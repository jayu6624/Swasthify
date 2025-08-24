import os
import json
import requests
import re
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv
import absl.logging
absl.logging.set_verbosity(absl.logging.ERROR)
# Load environment variables
load_dotenv()

class MealAnalyzer:
    def __init__(self):
        # Initialize Gemini service
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.vision_model = genai.GenerativeModel('gemini-1.5-flash')
        self.text_model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Nutritionix API credentials
        self.nutritionix_headers = {
            'Content-Type': 'application/json',
            'x-app-id': '4f1980f8',
            'x-app-key': 'e3d81f54bb9235291986ce12c60405da'
        }
        self.nutritionix_url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    
    def analyze_food_image(self, image_path):
        """Analyze food image with Gemini and return nutrition information and ingredients"""
        try:
            img = Image.open(image_path)
            
            prompt = """
            Analyze this image and provide detailed nutritional information.
            
            If the image contains food, provide:
            1. A detailed JSON object with nutritional information including:
               - calories (kcal)
               - protein (g)
               - carbohydrates (g)
               - fats (g)
               - fiber (g)
               - serving_size (g) - IMPORTANT: estimate the serving size shown in the image
            
            2. A comprehensive list of all visible ingredients with their estimated quantities
               (e.g., "1 cup rice", "2 chapatis", "100g chicken")
            
            Format your response as a valid JSON object with these keys:
            - "nutrition" (containing all nutrition values)
            - "ingredients" (array of ingredient names with quantities)
            
            If the image does NOT contain food, return a JSON with:
            {
              "nutrition": null,
              "ingredients": [],
              "error": "No food detected in the image"
            }
            
            Return ONLY the JSON with no additional text, explanations, or formatting.
            """
            
            response = self.vision_model.generate_content([prompt, img])
            response_text = response.text
            print("[DEBUG] Gemini AI raw response:", response_text, file=sys.stderr)
            
            # Extract JSON from the response text that might be wrapped in markdown code blocks
            response_text = response.text
            
            # Try to extract JSON from markdown code blocks if present
            json_pattern = r'```(?:json)?\s*([\s\S]*?)\s*```'
            json_match = re.search(json_pattern, response_text)
            
            if json_match:
                # Use the content inside the code block
                json_str = json_match.group(1).strip()
            else:
                # Use the whole response if no code block is found
                json_str = response_text.strip()
            
            # Try to parse the extracted text as JSON
            try:
                json_response = json.loads(json_str)
                return json_response
            except json.JSONDecodeError:
                return {
                    "raw_response": response_text,
                    "error": "Invalid JSON response from AI model"
                }
                
        except Exception as e:
            return {"error": f"Error analyzing image: {str(e)}"}
    
    def get_nutrition_for_ingredients(self, ingredients_list):
        """Get nutritional information for ingredients via API"""
        nutrition_data = {}
        
        if not ingredients_list or len(ingredients_list) == 0:
            return {"error": "No ingredients provided"}
        
        for ingredient in ingredients_list:
            try:
                payload = {"query": ingredient}
                response = requests.post(
                    self.nutritionix_url,
                    headers=self.nutritionix_headers,
                    json=payload
                )
                print(f"[DEBUG] Nutritionix response for {ingredient}:", response.text, file=sys.stderr)
                
                if response.status_code == 200:
                    data = response.json()
                    if "foods" in data and len(data["foods"]) > 0:
                        food_item = data["foods"][0]
                        nutrition_data[ingredient] = {
                            "name": food_item.get("food_name"),
                            "calories": food_item.get("nf_calories"),
                            "protein": food_item.get("nf_protein"),
                            "carbs": food_item.get("nf_total_carbohydrate"),
                            "fat": food_item.get("nf_total_fat"),
                            "fiber": food_item.get("nf_dietary_fiber"),
                            "serving_weight_grams": food_item.get("serving_weight_grams"),
                            "serving_unit": food_item.get("serving_unit"),
                            "serving_qty": food_item.get("serving_qty")
                        }
                    else:
                        nutrition_data[ingredient] = {"error": "No data found"}
                else:
                    nutrition_data[ingredient] = {"error": f"API error: {response.status_code}"}
            except Exception as e:
                nutrition_data[ingredient] = {"error": f"Failed to get nutrition data: {str(e)}"}
        
        return nutrition_data
    
    def refine_nutrition_analysis(self, initial_analysis, scraped_data):
        """Refine nutrition analysis using web-scraped data"""
        
        prompt = f"""
        I need to determine the most accurate nutritional information for each individual part.
        Initial AI analysis: {json.dumps(initial_analysis)}
        Web-scraped data: {json.dumps(scraped_data)}

        Instructions:
        1. Produce a breakdown for each detected food item.
        2. When conflicts arise, prefer the web-scraped data while maintaining the nutritional proportions from the initial analysis.
        3. If the dish is a single item (e.g., "pizza"), output only that item without breaking it down further.
        4. If the dish is a composite meal (e.g., "Gujarati thali"), provide a detailed breakdown for each component.

        Output Format:
        Return ONLY a valid JSON object with exactly two keys:
        - "final_analysis": an array where each element is an object with the following fields:
            • name
            • quantity
            • quantity unit (e.g., "g", "ml" ,"cup" , "tbsp" ,"unit")
            • calories
            • protein
            • carbohydrates
            • fats
            • fiber
        - "serving_size": a number representing the serving size in grams (as estimated in the initial analysis)

        No additional text or formatting is allowed. The final output must strictly adhere to this JSON structure.
        """



        # prompt = f"""
        # I need to determine the most accurate nutritional information for each individual part.
        # Initial AI analysis: {json.dumps(initial_analysis)}
        # Web-scraped data: {json.dumps(scraped_data)}


        # Please produce a breakdown for each detected item. If there's only one item, include only that. When conflicts arise, prefer the web-scraped data while maintaining proportions from the initial analysis.
        # make sure  The output must be in this format only for any input:
        #     Return ONLY a valid JSON array, where each item has :
        #     - name
        #     - quantity
        #     - calories
        #     - protein
        #     - carbohydrates
        #     - fats
        #     - fiber

        # Also include a separate "serving_size" field (in grams) as estimated in the initial analysis. Provide no additional text, just the JSON.
        # """
        # Return ONLY a valid JSON array, where each detected item has:

        # prompt = f"""
        # I need to determine the most accurate nutritional information for a meal.
        
        # Initial AI analysis: {json.dumps(initial_analysis)}
        
        # Web-scraped nutritional data for ingredients: {json.dumps(scraped_data)}
        
        # Please analyze these information sources and provide the most accurate nutritional breakdown.
        # Use the serving size from the initial analysis. Consider cooking methods and ingredient combinations.
        
        # When there's a conflict between the initial analysis and web-scraped data, prefer the web-scraped data
        # for individual ingredients but keep the overall proportion consistent with the initial analysis.
        
        # Return ONLY a JSON object with these fields:
        # - calories (kcal)
        # - protein (g)
        # - carbohydrates (g)
        # - fats (g) 
        # - fiber (g)
        # - serving_size (g) - use the value from the initial analysis
        
        # Give ONLY the valid JSON output with no additional text or explanations.
        # """
        
        response = self.text_model.generate_content(prompt)
        
        # Extract JSON from markdown code blocks if present
        response_text = response.text
        json_pattern = r'```(?:json)?\s*([\s\S]*?)\s*```'
        json_match = re.search(json_pattern, response_text)
        
        if json_match:
            # Use the content inside the code block
            json_str = json_match.group(1).strip()
        else:
            # Use the whole response if no code block is found
            json_str = response_text.strip()
        
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            return {"error": "Invalid JSON in final analysis", "raw_response": response_text}
    
    def analyze_meal(self, image_path):
        """Complete meal analysis pipeline"""
        # Step 1: Analyze image with Gemini
        initial_analysis = self.analyze_food_image(image_path)
        print("[DEBUG] Initial analysis:", initial_analysis, file=sys.stderr)
        
        # Check if there's an error or no food detected
        if "error" in initial_analysis:
            return {"status": "error", "message": initial_analysis["error"]}
        
        # Extract ingredients from initial analysis
        ingredients_list = initial_analysis.get("ingredients", [])
        if not ingredients_list:
            ingredients_list = []
        
        # Step 2: Web scrape nutritional information if ingredients were detected
        scraped_data = {}
        if ingredients_list:
            scraped_data = self.get_nutrition_for_ingredients(ingredients_list)
            print("[DEBUG] Scraped nutrition data:", scraped_data, file=sys.stderr)
        
        # Step 3: Combine data and get refined analysis
        final_analysis = initial_analysis
        if ingredients_list and not all("error" in scraped_data.get(ing, {}) for ing in ingredients_list):
            refined = self.refine_nutrition_analysis(initial_analysis, scraped_data)
            print("[DEBUG] Refined analysis:", refined, file=sys.stderr)
            if "error" not in refined:
                final_analysis = refined
        print("[DEBUG] Final output:", final_analysis, file=sys.stderr)
        return  final_analysis
        
        


# Function to be called from JavaScript
def analyze_image(image_path):
    """Analyze a meal image and return JSON results.
    This function can be imported and called from JavaScript."""
    try:
        analyzer = MealAnalyzer()
        results = analyzer.analyze_meal(image_path)
        return json.dumps(results)
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})


# If run directly from command line
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python meal_analyzer.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    result = analyze_image(image_path)
    print(result)  # Only print the JSON string to stdout
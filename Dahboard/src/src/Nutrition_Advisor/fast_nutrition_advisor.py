import os
import json
import sys
from dotenv import load_dotenv
import google.generativeai as genai
import requests
from concurrent.futures import ThreadPoolExecutor
import streamlit as st

# Load environment variables
load_dotenv()

# Set up API keys
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyAH5vwOH_QCqRpfz2yw1ZZ6C_gF1Y8sv8k")
SERPER_API_KEY = os.environ.get("SERPER_API_KEY")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

def search_web(query):
    """Search the web using Serper API."""
    if not SERPER_API_KEY:
        return "No SERPER_API_KEY found. Unable to perform web search."
    
    headers = {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json'
    }
    
    payload = {
        'q': query,
        'gl': 'us',
        'hl': 'en',
        'num': 5
    }
    
    response = requests.post('https://google.serper.dev/search', headers=headers, json=payload)
    
    if response.status_code == 200:
        results = response.json()
        formatted_results = ""
        
        if 'organic' in results:
            for item in results['organic'][:5]:
                formatted_results += f"Title: {item.get('title', 'No title')}\n"
                formatted_results += f"Snippet: {item.get('snippet', 'No snippet')}\n"
                formatted_results += f"URL: {item.get('link', 'No link')}\n\n"
        
        return formatted_results
    else:
        return f"Error searching the web: {response.status_code}"

def get_gemini_response(prompt, model="gemini-2.0-flash"):
    """Get response from Gemini model."""
    try:
        model = genai.GenerativeModel(model)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error with Gemini API: {str(e)}"

def nutrition_research(user_info):
    """Research nutritional needs based on demographics."""
    prompt = f"""As a Nutrition Specialist, research nutritional needs for an individual with the following demographics:
    - Age: {user_info['age']}
    - Gender: {user_info['gender']}
    - Height: {user_info['height']}
    - Weight: {user_info['weight']}
    - Activity Level: {user_info['activity_level']}
    - Goals: {user_info['goals']}
    
    Develop a comprehensive nutrition plan that includes:
        1. Specific foods to eat daily, weekly, and occasionally with portion sizes
        2. A 7-day meal plan with specific meals and recipes
        3. Meal preparation tips and simple recipes
        4. Hydration schedule and recommended beverages
        
    Your response should be a comprehensive, practical, and personalized nutrition plan.Keep it concise and to the point.
        
    """
    # Provide detailed nutritional requirements including:
    # 1. Caloric needs (basal and adjusted for activity)
    # 2. Macronutrient distribution (proteins, carbs, fats)
    # 3. Key micronutrients particularly important for this demographic
    # 4. Hydration requirements
    # 5. Meal timing and frequency recommendations
    
    # Your response should be comprehensive with scientific rationale.
    
    # Enhance with web search
    search_query = f"nutritional requirements for {user_info['age']} year old {user_info['gender']} with {user_info['activity_level']} activity level and goals of {user_info['goals']}"
    search_results = search_web(search_query)
    
    enhanced_prompt = prompt + f"\n\nHere is additional information from recent research:\n{search_results}"
    return get_gemini_response(enhanced_prompt)

def medical_analysis(user_info, nutrition_profile):
    """Analyze medical conditions and adjust nutritional recommendations."""
    prompt = f"""As a Medical Nutrition Therapist, analyze the following medical conditions and medications, then provide dietary modifications:
    - Medical Conditions: {user_info['medical_conditions']}
    - Medications: {user_info['medications']}
    - Allergies/Intolerances: {user_info['allergies']}
    
    Consider this baseline nutritional profile:
    {nutrition_profile}
    
    Provide:
    1. Specific nutrients to increase or limit based on each condition
    2. Food-medication interactions to avoid
    3. Potential nutrient deficiencies associated with these conditions/medications
    4. Foods that may help manage symptoms or improve outcomes
    5. Foods to strictly avoid
    
    Your response should be a detailed analysis of medical nutrition therapy adjustments.
    """
    
    # Enhance with web search
    search_query = f"dietary modifications for {user_info['medical_conditions']} with medications {user_info['medications']}"
    search_results = search_web(search_query)
    
    enhanced_prompt = prompt + f"\n\nHere is additional information from recent research:\n{search_results}"
    return get_gemini_response(enhanced_prompt)

def create_diet_plan(user_info, nutrition_profile, medical_analysis):
    """Create a comprehensive diet plan."""
    prompt = f"""As a Therapeutic Diet Planner, create a detailed, practical diet plan incorporating all information:
    - User's Food Preferences: {user_info['food_preferences']}
    - Cooking Skills/Time: {user_info['cooking_ability']}
    - Budget Constraints: {user_info['budget']}
    - Cultural/Religious Factors: {user_info['cultural_factors']}
    
    Nutrition Profile:
    {nutrition_profile}
    
    Medical Considerations:
    {medical_analysis}
    
    Develop a comprehensive nutrition plan that includes:
    1. Specific foods to eat daily, weekly, and occasionally with portion sizes
    2. A 7-day meal plan with specific meals and recipes
    3. Grocery shopping list with specific items
    4. Meal preparation tips and simple recipes
    5. Eating out guidelines and suggested restaurant options/orders
    6. Supplement recommendations if necessary (with scientific justification)
    7. Hydration schedule and recommended beverages
    8. How to monitor progress and potential adjustments over time
    
    Your response should be a comprehensive, practical, and personalized nutrition plan.
    """
    
    return get_gemini_response(prompt)

def run_nutrition_advisor(user_info):
    """Run the nutrition advisor with parallel processing for speed."""
    try:
        # Run nutrition research
        nutrition_profile = nutrition_research(user_info)
        
        # Run medical analysis
        med_analysis = medical_analysis(user_info, nutrition_profile)
        
        # Create diet plan
        diet_plan = create_diet_plan(user_info, nutrition_profile, med_analysis)
        
        # Combine results
        final_result = f"""# Personalized Nutrition Plan

## Nutritional Profile
{nutrition_profile}

## Medical Considerations
{med_analysis}

## Your Customized Diet Plan
{diet_plan}
"""
        return final_result
    except Exception as e:
        return f"An error occurred: {str(e)}"

def run_faster_nutrition_advisor(user_info):
    """Run the nutrition advisor with parallel processing for speed."""
    try:
        # Use ThreadPoolExecutor to run tasks in parallel
        with ThreadPoolExecutor(max_workers=2) as executor:
            # Start nutrition research
            nutrition_future = executor.submit(nutrition_research, user_info)
            
            # Wait for nutrition research to complete
            nutrition_profile = nutrition_future.result()
            
            # Start medical analysis and diet planning concurrently
            med_analysis_future = executor.submit(medical_analysis, user_info, nutrition_profile)
            
            # Wait for medical analysis to complete
            med_analysis = med_analysis_future.result()
            
            # Create diet plan
            diet_plan = create_diet_plan(user_info, nutrition_profile, med_analysis)
        
        # Combine results
        final_result = f"""# Personalized Nutrition Plan

## Nutritional Profile
{nutrition_profile}

## Medical Considerations
{med_analysis}

## Your Customized Diet Plan
{diet_plan}
"""
        return final_result
    except Exception as e:
        return f"An error occurred: {str(e)}"

def process_input(input_data):
    """Process input data from JavaScript."""
    try:
        # Parse input data
        if isinstance(input_data, str):
            user_info = json.loads(input_data)
        else:
            user_info = input_data
            
        # Ensure all required fields are present
        required_fields = [
            "age", "gender", "height", "weight", "activity_level", "goals",
            "medical_conditions", "medications", "allergies", "food_preferences",
            "cooking_ability", "budget", "cultural_factors"
        ]
        
        for field in required_fields:
            if field not in user_info:
                user_info[field] = "Not specified"
        
        # Run the nutrition advisor
        result = run_faster_nutrition_advisor(user_info)
        
        return result
    except Exception as e:
        return json.dumps({"error": str(e)})

def app():
    """Main Streamlit application."""
    st.set_page_config(page_title="Fast Nutrition Advisor", page_icon="🥗", layout="wide")
    
    st.title("🥗 Fast Nutrition Advisor")
    st.markdown("""
    Get a detailed nutrition plan based on your demographics, health conditions, and preferences.
    Our AI team of nutrition specialists will create a personalized recommendation just for you.
    This version runs in under 1 minute!
    """)
    
    # Create tabs for organization
    tab1, tab2, tab3 = st.tabs(["Basic Information", "Health Details", "Preferences & Lifestyle"])
    
    with tab1:
        st.header("Personal Information")
        col1, col2 = st.columns(2)
        
        with col1:
            age = st.number_input("Age", min_value=1, max_value=120, value=30)
            gender = st.selectbox("Gender", ["Male", "Female", "Non-binary/Other"])
            height = st.text_input("Height (e.g., 5'10\" or 178 cm)", "5'10\"")
            
        with col2:
            weight = st.text_input("Weight (e.g., 160 lbs or 73 kg)", "160 lbs")
            activity_level = st.select_slider(
                "Activity Level",
                options=["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extremely Active"]
            )
            goals = st.multiselect(
                "Nutrition Goals",
                ["Weight Loss", "Weight Gain", "Maintenance", "Muscle Building", "Better Energy", 
                 "Improved Athletic Performance", "Disease Management", "General Health"]
            )
    
    with tab2:
        st.header("Health Information")
        
        medical_conditions = st.text_area(
            "Medical Conditions (separate with commas)",
            placeholder="E.g., Diabetes Type 2, Hypertension, Hypothyroidism..."
        )
        
        medications = st.text_area(
            "Current Medications (separate with commas)",
            placeholder="E.g., Metformin, Lisinopril, Levothyroxine..."
        )
        
        allergies = st.text_area(
            "Food Allergies/Intolerances (separate with commas)",
            placeholder="E.g., Lactose, Gluten, Shellfish, Peanuts..."
        )
    
    with tab3:
        st.header("Preferences & Lifestyle")
        
        col1, col2 = st.columns(2)
        
        with col1:
            food_preferences = st.text_area(
                "Food Preferences & Dislikes",
                placeholder="E.g., Prefer plant-based, dislike seafood..."
            )
            
            cooking_ability = st.select_slider(
                "Cooking Skills & Available Time",
                options=["Very Limited", "Basic/Quick Meals", "Average", "Advanced/Can Spend Time", "Professional Level"]
            )
        
        with col2:
            budget = st.select_slider(
                "Budget Considerations",
                options=["Very Limited", "Budget Conscious", "Moderate", "Flexible", "No Constraints"]
            )
            
            cultural_factors = st.text_area(
                "Cultural or Religious Dietary Factors",
                placeholder="E.g., Halal, Kosher, Mediterranean tradition..."
            )
    
    # Collect all user information
    user_info = {
        "age": age,
        "gender": gender,
        "height": height,
        "weight": weight,
        "activity_level": activity_level,
        "goals": ", ".join(goals) if goals else "General health improvement",
        "medical_conditions": medical_conditions or "None reported",
        "medications": medications or "None reported",
        "allergies": allergies or "None reported",
        "food_preferences": food_preferences or "No specific preferences",
        "cooking_ability": cooking_ability,
        "budget": budget,
        "cultural_factors": cultural_factors or "No specific factors"
    }
    
    # Check if API keys are present
    if not GEMINI_API_KEY:
        st.warning("⚠️ GEMINI_API_KEY not detected. Please add your GEMINI_API_KEY to your .env file.")
    
    # Create a submission button
    if st.button("Generate Nutrition Plan"):
        if not goals:
            st.error("Please select at least one nutrition goal.")
            return
        
        # Display user information summary
        with st.expander("Summary of Your Information"):
            st.json(user_info)
        
        # Run the nutrition advisor with progress indicator
        with st.spinner('Our nutrition team is creating your personalized plan. This will take less than a minute...'):
            result = run_faster_nutrition_advisor(user_info)
        
        if result:
            st.success("✅ Your personalized nutrition plan is ready!")
            st.markdown("## Your Personalized Nutrition Plan")
            st.markdown(result)
            
            # Add download capability
            st.download_button(
                label="Download Nutrition Plan",
                data=result,
                file_name="my_nutrition_plan.md",
                mime="text/markdown"
            )

if __name__ == "__main__":
    # Check if input is provided as command line argument
    if len(sys.argv) > 1:
        # Read input from command line argument
        input_data = sys.argv[1]
        result = process_input(input_data)
        print(result)
    elif len(sys.argv) == 1 and not sys.stdin.isatty():
        # Check if input is provided via stdin
        try:
            input_data = sys.stdin.read()
            if input_data:
                result = process_input(input_data)
                print(result)
            else:
                print(json.dumps({"error": "No input provided"}))
        except Exception as e:
            print(json.dumps({"error": f"Error processing input: {str(e)}"}))
    else:
        # No command line arguments or stdin input, run the Streamlit app
        app() 
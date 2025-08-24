import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const API_BASE_URL = "http://localhost:4000/api/user/profile";

const Profile = () => {
  const { userId } = useParams(); // Get userId from URL if available
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "",
  });

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      let response;

      if (userId) {
        response = await axios.get(`${API_BASE_URL}/${userId}`, config);

        // Check if this is the current user's profile
        const currentUserInfo = await axios.get(`${API_BASE_URL}/me`, config);
        setIsCurrentUser(currentUserInfo.data.profile.user._id === userId);
      } else {
        response = await axios.get(`${API_BASE_URL}/me`, config);
        setIsCurrentUser(true);
      }

      if (response.data.success) {
        const profileData = response.data.profile;
        setUser(profileData.user);
        setProfile(profileData);
        setFormData({
          height: profileData.height || "",
          weight: profileData.weight || "",
          age: profileData.age || "",
          gender: profileData.gender || "",
        });
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load profile.");
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.put(`${API_BASE_URL}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setProfile(response.data.profile);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Error updating profile.");
      }
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    const { activity } = e.target.elements;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/activity`,
        { activity: activity.value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setProfile(response.data.profile);
        // Reset form
        e.target.reset();
        alert("Activity added successfully!");
      } else {
        throw new Error("Failed to add activity");
      }
    } catch (err) {
      console.error("Error adding activity:", err);
      alert(err.response?.data?.message || "Error adding activity.");
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    const { message, time } = e.target.elements;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/reminder`,
        {
          message: message.value,
          time: time.value,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setProfile(response.data.profile);
        // Reset form
        e.target.reset();
        alert("Reminder added successfully!");
      } else {
        throw new Error("Failed to add reminder");
      }
    } catch (err) {
      console.error("Error adding reminder:", err);
      alert(err.response?.data?.message || "Error adding reminder.");
    }
  };

  return (
    <Container className="theme-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <>
          <Row className="justify-content-center mt-4">
            <Col md={8}>
              <Card className="profile-card">
                <Card.Body>
                  <h3 className="mb-4">
                    {isCurrentUser
                      ? "Your Profile"
                      : `${user?.name || "User"}'s Profile`}
                  </h3>
                  <p>
                    <strong>Height:</strong> {profile.height} cm
                  </p>
                  <p>
                    <strong>Weight:</strong> {profile.weight} kg
                  </p>
                  <p>
                    <strong>Age:</strong> {profile.age}
                  </p>
                  <p>
                    <strong>Gender:</strong> {profile.gender}
                  </p>

                  {/* Display streaks */}
                  <h5 className="mt-4">Streak Information</h5>
                  <p>
                    <strong>Current streak:</strong> {profile.streaks.count}{" "}
                    days
                  </p>
                  <p>
                    <strong>Last updated:</strong>{" "}
                    {new Date(profile.streaks.lastUpdated).toLocaleDateString()}
                  </p>

                  {/* Display activity history */}
                  <h5 className="mt-4">Activity History</h5>
                  {profile.snapHistory && profile.snapHistory.length > 0 ? (
                    <ul className="list-group">
                      {profile.snapHistory.slice(0, 5).map((snap, index) => (
                        <li key={index} className="list-group-item">
                          <strong>
                            {new Date(snap.date).toLocaleDateString()}:
                          </strong>{" "}
                          {snap.activity}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No activity history yet.</p>
                  )}

                  {/* Display reminders */}
                  <h5 className="mt-4">Reminders</h5>
                  {profile.reminders && profile.reminders.length > 0 ? (
                    <ul className="list-group">
                      {profile.reminders.map((reminder, index) => (
                        <li key={index} className="list-group-item">
                          <strong>{reminder.time}:</strong> {reminder.message}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No reminders set.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Only show edit forms if this is the current user's profile */}
          {isCurrentUser && (
            <>
              {/* Edit Profile Form */}
              <Row className="justify-content-center mt-4">
                <Col md={8}>
                  <Card>
                    <Card.Body>
                      <h5>Update Your Profile</h5>
                      <Form onSubmit={handleSubmit}>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Height (cm)</Form.Label>
                              <Form.Control
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Weight (kg)</Form.Label>
                              <Form.Control
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Age</Form.Label>
                              <Form.Control
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Gender</Form.Label>
                              <Form.Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Button
                          variant="primary"
                          type="submit"
                          className="mt-3"
                        >
                          Update Profile
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Add Activity Form */}
              <Row className="justify-content-center mt-4">
                <Col md={8}>
                  <Card>
                    <Card.Body>
                      <h5>Add Activity</h5>
                      <Form onSubmit={handleAddActivity}>
                        <Form.Group className="mb-3">
                          <Form.Label>Activity Description</Form.Label>
                          <Form.Control
                            type="text"
                            name="activity"
                            placeholder="E.g., 30 minutes jogging"
                            required
                          />
                        </Form.Group>
                        <Button variant="success" type="submit">
                          Add Activity
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Add Reminder Form */}
              <Row className="justify-content-center mt-4 mb-5">
                <Col md={8}>
                  <Card>
                    <Card.Body>
                      <h5>Add Reminder</h5>
                      <Form onSubmit={handleAddReminder}>
                        <Row>
                          <Col md={8}>
                            <Form.Group className="mb-3">
                              <Form.Label>Reminder Message</Form.Label>
                              <Form.Control
                                type="text"
                                name="message"
                                placeholder="E.g., Take morning medication"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>Time</Form.Label>
                              <Form.Control type="time" name="time" required />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Button variant="info" type="submit">
                          Add Reminder
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Profile;

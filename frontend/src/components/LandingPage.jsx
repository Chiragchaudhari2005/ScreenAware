import React from 'react';
import './LandingPage.css'; // We will use the new CSS file
import screenLogo from '../assests/sa-logo-1.png'; // Make sure this path is correct
import CardCarousel from './CardCarousel'; 

// Icons for the feature cards and new sections
import { IoBarChartOutline, IoBulbOutline, IoSparklesOutline, IoPersonCircleOutline } from 'react-icons/io5';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-page-v2">
      {/* ------------------ Navbar ------------------ */}
      <header className="navbar-v2">
        <div className="nav-container-v2">
          <a href="#" className="nav-logo-v2">
            <img src={screenLogo} alt="ScreenAware Logo" className="landing-logo" />
            <span>ScreenAware</span>
          </a>
          <nav className="nav-links-v2">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
          </nav>
          {/* Add a hamburger menu icon here for mobile later */}
          <div className="nav-buttons-v2">
            <button className="btn-v2 btn-login-v2" onClick={() => onNavigate && onNavigate('login')}>Log In</button>
            <button className="btn-v2 btn-signup-v2" onClick={() => onNavigate && onNavigate('signup')}>Sign Up</button>
          </div>
        </div>
      </header>

      {/* ------------------ Hero Section ------------------ */}
      <main className="hero-section-v2">
        <div className="hero-content-v2">
          <div className="hero-text">
            <h1 className="slogan-v2">Find Your Balance in a Digital World.</h1>
            <p className="hero-subtitle-v2">
              Transform screen time into quality time. ScreenAware is your personal guide to digital wellness and mental clarity.
            </p>
            <button className="btn-v2 btn-get-started-v2" onClick={() => onNavigate && onNavigate('signup')}>Get Started for Free</button>
          </div>
          <div className="hero-graphic">
            <CardCarousel />
          </div>
        </div>
      </main>

      {/* ------------------ Features Section ------------------ */}
      <section id="features" className="features-section-v2">
        <div className="section-container">
          <h2 className="section-title">Everything You Need for Digital Wellbeing</h2>
          <div className="features-grid-v2">
            <div className="feature-card-v2">
              <div className="feature-icon-wrapper-v2" style={{ backgroundColor: '#DFF7F0' }}> {/* Mint Green */}
                <IoBarChartOutline className="feature-icon-v2" />
              </div>
              <h3>Analyze Your Habits</h3>
              <p>Understand your screen time with insightful analytics and identify patterns of digital addiction.</p>
            </div>
            <div className="feature-card-v2">
              <div className="feature-icon-wrapper-v2" style={{ backgroundColor: '#FFF9D9' }}> {/* Lemon */}
                <IoBulbOutline className="feature-icon-v2" />
              </div>
              <h3>Get Personalized Tips</h3>
              <p>Receive actionable advice and mindfulness exercises tailored to improve your mental clarity.</p>
            </div>
            <div className="feature-card-v2">
              <div className="feature-icon-wrapper-v2" style={{ backgroundColor: '#F6CACA' }}> {/* Coral */}
                <IoSparklesOutline className="feature-icon-v2" />
              </div>
              <h3>Build Better Routines</h3>
              <p>Set meaningful goals and take on challenges designed to help you disconnect and rediscover balance.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* ------------------ How It Works Section (Timeline Version) ------------------ */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <h2 className="section-title">Get Started in 3 Simple Steps</h2>
          <div className="steps-timeline-grid">
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Log Your Day</h3>
                <p>Easily input your screen time, sleep hours, and mood to create a complete picture of your wellbeing.</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>View Your Insights</h3>
                <p>Our analysis reveals patterns and provides you with easy-to-understand charts and personalized tips.</p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Achieve Your Goals</h3>
                <p>Use our tools to set meaningful goals, build healthier habits, and find your perfect digital balance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------ NEW: Testimonials Section ------------------ */}
      <section id="testimonials" className="testimonials-section">
          <div className="section-container">
              <h2 className="section-title">Trusted by People Like You</h2>
              <div className="testimonials-grid">
                  <div className="testimonial-card">
                      <p>"ScreenAware has been a game-changer for my focus. I finally feel in control of my digital habits instead of them controlling me."</p>
            <div className="testimonial-author">
              <IoPersonCircleOutline className="author-icon" />
              <span>Student</span>
            </div>
                  </div>
                  <div className="testimonial-card">
                      <p>"I love the gentle reminders and personalized tips. It's like having a wellness coach in my pocket. Highly recommended!"</p>
                      <div className="testimonial-author">
                           <IoPersonCircleOutline className="author-icon" />
                          <span>Sarah K., Designer</span>
                      </div>
                  </div>
                  <div className="testimonial-card">
                      <p>"Finally, an app that doesn't make you feel guilty about screen time, but empowers you to be more mindful. The insights are fantastic."</p>
                      <div className="testimonial-author">
                           <IoPersonCircleOutline className="author-icon" />
                          <span>Mike R., Developer</span>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* ------------------ Call to Action Section ------------------ */}
      <section className="cta-section-v2">
          <div className="section-container">
            <h2 className="cta-title">Ready to Reclaim Your Time?</h2>
            <p>Join thousands of others on the journey to digital wellness.</p>
            <button className="btn-v2 btn-signup-v2 cta-button" onClick={() => onNavigate && onNavigate('signup')}>Start Your Free Trial</button>
          </div>
      </section>

      {/* ------------------ Footer ------------------ */}
      <footer className="footer-v2">
        <div className="footer-container">
          <div className="footer-about">
            <div className="nav-logo-v2">
              <img src={screenLogo} alt="ScreenAware Logo" className="landing-logo" />
              <span>ScreenAware</span>
            </div>
            <p>Your guide to mindful technology use.</p>
          </div>
          <div className="footer-links">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Updates</a>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ScreenAware. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
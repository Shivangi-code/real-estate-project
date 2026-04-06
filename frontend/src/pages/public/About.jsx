import "../../styles/about.css";

function About() {
  return (
    <section className="about">

      {/* Header Full Width */}
      <section className="blue-bg-full">
        <div className="blue-bg-content">
          <h1>About Housify Realty</h1>
          <p>Your Trusted Real Estate Partner</p>
        </div>
      </section>

      <div className="about-container">

        <p className="desc">
          Welcome to <strong>Housify Realty</strong>, a trusted real estate platform based in Jabalpur. 
          Founded in March 2026, we are dedicated to helping people find the perfect property with 
          transparency, reliability, and professional support.
        </p>

        <p className="desc">
          At Housify Realty, we specialize in connecting buyers, sellers, and investors with the best 
          residential and commercial properties in Jabalpur and nearby areas. Our goal is to make the 
          property buying and selling process simple, secure, and hassle-free.
        </p>

        <p className="desc">
          We understand that purchasing a property is one of the most important decisions in life. 
          That’s why our team focuses on providing verified property listings, honest guidance, 
          and complete assistance throughout the entire process.
        </p>

        {/* Services */}
        <div className="about-box">
          <h2>Our Services</h2>
          <ul>
            <li>🏡 Buying and selling residential properties</li>
            <li>📍 Plot and land deals</li>
            <li>📈 Property investment consulting</li>
            <li>🏠 Rental property assistance</li>
          </ul>
        </div>

      </div>

      {/* Mission Full Width */}
      <section className="blue-bg-full">
        <div className="blue-bg-content">
          <h2>Our Mission</h2>
          <p>
            To provide transparent and trustworthy real estate solutions while helping clients 
            find the perfect place they can call home.
          </p>
        </div>
      </section>

      <div className="about-container">

        {/* Why Choose */}
        <div className="about-box">
          <h2>Why Choose Housify Realty</h2>
          <ul>
            <li>✔ Local market knowledge of Jabalpur</li>
            <li>✔ Trusted and transparent property deals</li>
            <li>✔ Personalized customer support</li>
            <li>✔ Verified property options</li>
          </ul>
        </div>

      </div>

      {/* Final Line Full Width */}
      <section className="blue-bg-full">
        <div className="blue-bg-content">
          <p>
            At Housify Realty, we believe that finding the right property should be simple, safe, and rewarding.
          </p>
        </div>
      </section>

    </section>
  );
}

export default About;
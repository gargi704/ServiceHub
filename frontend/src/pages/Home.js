import React, { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Footer from '../components/Footer';

function Home() {
  const serviceRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  const scrollToServices = () => {
    serviceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar scrollToServices={scrollToServices} />
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div ref={serviceRef}>
        <Services filter={searchQuery} />
      </div>
      <Footer />
    </div>
  );
}
export default Home;

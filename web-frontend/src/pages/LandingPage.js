import React from 'react';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import logo from '../PDC Logo Transparent.jpg';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

const heroImg = 'https://puertollanodental.com/hero_image1.jpg'; // Placeholder dental hero image

const services = [
  {
    title: 'Check-Ups & Cleanings',
    desc: 'Comprehensive exams, cleaning, and preventive care.',
    img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Cosmetic Dentistry',
    desc: 'Teeth whitening, veneers, and smile makeovers.',
    img: 'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Orthodontics',
    desc: 'Braces and aligners for all ages.',
    img: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Teeth Whitening',
    desc: 'Professionally whitening your teeth can help ensure your smile is making the best impression possible.',
    img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80'
  },
];

const locations = [
  { name: 'Binan', address: '2nd Flr, Red Commercial Complex, San Francisco Rd, Biñan, 4024 Laguna', map: '#', phone: '09171084488', clinichours: 'Wed,Fri-Mon: 9am - 6pm' },
  { name: 'Pasig', address: 'Unit 3B 10 MVS 2 Place Bldg, Dr. Sixto Antonio Ave., Pasig, 1609 Metro Manila', map: '#', phone: '09171083285', clinichours: 'Tue,Thu-Sun: 9am - 6pm' },
];

const testimonials = [
  {
    name: 'Angela',
    text: "Puertollano Dental Clinic has been amazing for my dental care, especially for my braces journey. my teeth were once crooked, but now I can smile confidently. also their dentists are professional and gentle, making it perfect for anyone nervous about starting dental treatments. Highly recommended! thank you so much Doc Trish!",
    img: 'https://lh3.googleusercontent.com/a-/ALV-UjXwggDhRCINfJX-nq4qI11JANngqemYjHCyLwaRftaR1q4ScQ=w72-h72-p-rp-mo-br100'
  },
  {
    name: 'Danika',
    text: "I recently had an oral prophylaxis, and I couldn’t be happier with the experience! Doc Trish has incredibly gentle hands, which made the whole procedure surprisingly comfortable. From the moment I walked in, the staff was warm and welcoming, and the clinic’s atmosphere was very calming.The procedure itself was smooth, and Doc Trish made sure I understood every step, easing any anxiety I had.  Highly recommend this clinic for anyone looking for professional and gentle dental work.",
    img: 'https://lh3.googleusercontent.com/a-/ALV-UjUsr8sgEa6zV46QJQJdRLHcgUhCf3CZrLoJiNpxqljeFcvLLgXAxA=w72-h72-p-rp-mo-br100'
  },
  {
    name: 'Hannah',
    text: "I always dream of having a beautiful smile, Thank you Dr. Tricia for making it happen. Thank you for being so gentle and being the best. Im super happyyyy!!♥️",
    img: 'https://lh3.googleusercontent.com/a-/ALV-UjXTGqAoDSgM25sIDV1JXQD1vOADlr5yvMkm4v5Q7_Rq2JHEcIlD=w36-h36-p-rp-mo-br100'
  }
];

export default function LandingPage() {
  const [locationsAnchorEl, setLocationsAnchorEl] = React.useState(null);

  // Add state for map center selection
  const [mapCenter, setMapCenter] = React.useState(0); // 0: Binan, 1: Pasig

  const locationsOpen = Boolean(locationsAnchorEl);
  const handleLocationsMenu = (event) => {
    setLocationsAnchorEl(event.currentTarget);
  };
  const handleLocationsClose = () => {
    setLocationsAnchorEl(null);
  };

  const [servicesAnchorEl, setServicesAnchorEl] = React.useState(null);
  const servicesOpen = Boolean(servicesAnchorEl);
  const handleServicesMenu = (event) => {
    setServicesAnchorEl(event.currentTarget);
  };
  const handleServicesClose = () => {
    setServicesAnchorEl(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      color: '#009688',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      {/* Sticky Header */}
  <AppBar position="sticky" sx={{ background: 'rgba(255, 255, 255, 1)', boxShadow: 2 }}>
        <Toolbar
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            px: { xs: 1, sm: 2 },
            py: { xs: 1, sm: 0 }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' }, mb: { xs: 1, sm: 0 } }}>
            <img src={logo} alt="PDC Logo" style={{ height: 40, width: 'auto', marginRight: 8, background: 'white', borderRadius: 8, padding: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1, fontSize: { xs: 14, sm: 18 } }}>
             📞 09171084488 (Binan) / 09171083285 (Pasig)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 3 }, alignItems: 'center', flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            <span>
              <Link
                href="#services"
                underline="none"
                color="inherit"
                sx={{ fontSize: 18, fontWeight: 500, cursor: 'pointer' }}
                aria-controls={servicesOpen ? 'services-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={servicesOpen ? 'true' : undefined}
                onClick={handleServicesMenu}
              >
                Services
              </Link>
              <Menu
                id="services-menu"
                anchorEl={servicesAnchorEl}
                open={servicesOpen}
                onClose={handleServicesClose}
                MenuListProps={{ 'aria-labelledby': 'services-button' }}
              >
                <MenuItem onClick={handleServicesClose}>General Dentistry</MenuItem>
                <MenuItem onClick={handleServicesClose}>Cosmetic Dentistry</MenuItem>
                <MenuItem onClick={handleServicesClose}>Orthodontics</MenuItem>
                <MenuItem onClick={handleServicesClose}>Pediatric Dentistry</MenuItem>
              </Menu>
            </span>
            {/*<Link href="#about" underline="none" color="inherit" sx={{ fontSize: 18, fontWeight: 500, cursor: 'pointer' }}>About</Link>*/}
            <span>
              <Link
                href="#locations"
                underline="none"
                color="inherit"
                sx={{ fontSize: 18, fontWeight: 500, cursor: 'pointer' }}
                aria-controls={locationsOpen ? 'locations-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={locationsOpen ? 'true' : undefined}
                onClick={handleLocationsMenu}
              >
                Locations
              </Link>
              <Menu
                id="locations-menu"
                anchorEl={locationsAnchorEl}
                open={locationsOpen}
                onClose={handleLocationsClose}
                MenuListProps={{ 'aria-labelledby': 'locations-button' }}
              >
                <MenuItem onClick={handleLocationsClose}>Binan</MenuItem>
                <MenuItem onClick={handleLocationsClose}>Pasig</MenuItem>
              </Menu>
            </span>
            {/* <Link href="#contact" underline="none" color="inherit" sx={{ fontSize: 18, fontWeight: 500, cursor: 'pointer' }}>Contact</Link>*/}
            <Button href="/book" variant="contained" sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 }, background: '#009688', color: '#ffffffff', fontWeight: 600, fontSize: { xs: 14, sm: 16 } }}>
              Book an Appointment
            </Button>
            {/* Social Media Icons in Header */}
            <Box sx={{ display: 'flex', gap: 1, ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}>
              <Link href="https://www.facebook.com/PuertollanoDC" target="_blank" rel="noopener" color="inherit" aria-label="Facebook">
                <FacebookIcon fontSize="medium" />
              </Link>
              <Link href="https://instagram.com/puertollanodental" target="_blank" rel="noopener" color="inherit" aria-label="Instagram">
                <InstagramIcon fontSize="medium" />
              </Link>
              <Link href="https://twitter.com/puertollanodental" target="_blank" rel="noopener" color="inherit" aria-label="Twitter">
                <TwitterIcon fontSize="medium" />
              </Link>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>


      {/* Hero Image Section */}
      <section style={{
        width: '100%',
        minHeight: 500,
        background: `#fff url(${heroImg}) top/cover no-repeat`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '64px 16px 48px 16px',
      }}>
  <h2 style={{ fontSize: 44, color: '#044942ff', marginBottom: 16, textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          Experience the Difference
        </h2>
  <p style={{ fontSize: 24, color: '#044942ff', maxWidth: 700, margin: '0 auto 32px auto', textShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          Our dentists are specialized in different fields to address all your dental concerns and to make sure that you will be provided with unmatched care and safety.
        </p>
  <Button href="/book" variant="contained" size="large" sx={{ background: '#009688', color: '#fff', fontWeight: 600, fontSize: 22, px: 4, py: 1.5 }}>
          Book an Appointment
        </Button>
      </section>

      {/* Services Section */}
  <section id="services" style={{ background: '#e2fcf7ff', padding: '48px 0 32px 0' }}>
  <h3 style={{ textAlign: 'center', color: '#009688', fontSize: 32, marginBottom: 32, fontWeight: 700 }}>Our Services</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {services.map((s, i) => (
            <div key={i} style={{ background: '#fff', color: '#009688', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 28, maxWidth: 260, minWidth: 220, margin: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={s.img} alt={s.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12, marginBottom: 16, boxShadow: '0 1px 4px rgba(25,118,210,0.10)' }} />
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 10, textAlign: 'center' }}>{s.title}</div>
              <div style={{ fontSize: 16, textAlign: 'center' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Locations Section */}
  <section id="locations" style={{ background: '#f4fafd', padding: '48px 0 32px 0' }}>
  <h3 style={{ textAlign: 'center', color: '#009688', fontSize: 32, marginBottom: 32, fontWeight: 700 }}>Our Locations</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start', maxWidth: 1100, margin: '0 auto' }}>
          {/* Left Column: Clinic Details */}
          <div style={{ flex: 1, minWidth: 280, maxWidth: 400, background: '#fff', color: '#009688', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 32, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              {locations.map((loc, i) => (
                <Button key={loc.name} variant={mapCenter === i ? "contained" : "outlined"} sx={{ color: mapCenter === i ? '#fff' : '#1565c0', background: mapCenter === i ? '#1565c0' : 'transparent', borderColor: '#1565c0', fontWeight: 600, fontSize: 18, minWidth: 120 }} onClick={() => setMapCenter(i)}>
                  {loc.name}
                </Button>
              ))}
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 6 }}>{locations[mapCenter].name} Clinic</div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>{locations[mapCenter].address}</div>
              <div style={{ fontSize: 15, marginBottom: 8 }}><b>Clinic Hours:</b> {locations[mapCenter].clinichours}</div>
              <div style={{ fontSize: 15, marginBottom: 8 }}><b>Contact:</b> {locations[mapCenter].phone}</div>
              <div style={{ fontSize: 15, marginBottom: 8 }}><b>Email:</b> info@puertollanodental.com</div>
            </div>
          </div>
          {/* Right Column: Map */}
          <div style={{ flex: 2, minWidth: 320, maxWidth: 700, display: 'flex', justifyContent: 'center' }}>
            <iframe
              title="Clinic Map"
              key={mapCenter}
              src={mapCenter === 0
                ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3865.54975090994!2d121.06517117577054!3d14.33756628346106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d7452d042db1%3A0x6a9715db439579b5!2sPuertollano%20Dental%20Clinic%20Bi%C3%B1an!5e0!3m2!1sen!2sph!4v1756557952006!5m2!1sen!2sph"
                : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.273330825308!2d121.08131297577341!3d14.58349487749392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c7dba317c11f%3A0xe1920c0e351eb66d!2sPuertollano%20Dental%20Clinic%20-%20Pasig!5e0!3m2!1sen!2sph!4v1756557874958!5m2!1sen!2sph"}
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: 12, minWidth: 280, maxWidth: 700 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>


  {/* (Removed duplicate Hero Section) */}

      {/* Testimonials */}
  <section style={{ background: '#fff', padding: '48px 0 32px 0' }}>
  <h3 style={{ textAlign: 'center', color: '#009688', fontSize: 32, marginBottom: 32, fontWeight: 700 }}>Kind words from our patients</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: '#fff', color: '#009688', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 24, maxWidth: 320, minWidth: 260, margin: 8 }}>
              <img src={t.img} alt={t.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginBottom: 12 }} />
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{t.name}</div>
              <div style={{ fontSize: 16 }}>{t.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliated Companies Section */}
  <section style={{ background: '#f4fafd', padding: '40px 0 32px 0', borderTop: '2px solid #b2dfdb', borderBottom: '2px solid #b2dfdb' }}>
  <h3 style={{ textAlign: 'center', color: '#009688', fontSize: 28, marginBottom: 28, fontWeight: 700, letterSpacing: 1 }}>HMO Partners</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap', alignItems: 'center' }}>
          <img src="https://site.intellicare.com.ph/wp-content/uploads/2016/11/Intellicare_green-play.png" alt="Intellicare" style={{ height: 60, width: 220, objectFit: 'contain', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
          <img src="https://www.avega.com.ph/images/avega-logo.png" alt="Avega" style={{ height: 60, width: 180, objectFit: 'contain', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
          <img src="https://www.cocolife.com/wp-content/uploads/2021/02/Cocolife-New-Logo-ONE-LINE-with-outline-1024x243.png" alt="Cocolife" style={{ height: 60, width: 180, objectFit: 'contain', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
          <img src="https://shop.philcare.com.ph/image/catalog/philcare-new-logo.jpg" alt="Philcare" style={{ height: 60, width: 180, objectFit: 'contain', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
        </div>
      </section>

      {/* Footer */}
  <footer style={{ textAlign: 'center', padding: 32, color: '#009688', fontSize: 18, background: '#fff', borderTop: '2px solid #b2dfdb' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1 }}>Follow Us:
          <Link href="https://www.facebook.com/PuertollanoDC" target="_blank" rel="noopener" color="inherit" aria-label="Facebook">
            <FacebookIcon fontSize="large" />
          </Link>
          <Link href="https://instagram.com/puertollanodental" target="_blank" rel="noopener" color="inherit" aria-label="Instagram">
            <InstagramIcon fontSize="large" />
          </Link>
          <Link href="https://twitter.com/puertollanodental" target="_blank" rel="noopener" color="inherit" aria-label="Twitter">
            <TwitterIcon fontSize="large" />
          </Link>
        </Box>
        © {new Date().getFullYear()} Puertollano Dental Clinic. All Rights Reserved.
      </footer>
    </div>
  );
}

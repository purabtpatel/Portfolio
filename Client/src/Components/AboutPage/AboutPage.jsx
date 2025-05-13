import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faUser, faGamepad } from '@fortawesome/free-solid-svg-icons';
import './AboutPage.css';
import SectionComponent from './SectionComponent/SectionComponent';
import CodeShowcase from './CodeSnippet/CodeShowcase';

const AboutPage = () => {
  const [activeSection, setActiveSection] = useState('terminal');

  const sections = {
    terminal: {
      sectionName: 'professional',
      defaultSection: 'experience',
      textContent: {
        'experience': 'Over the past two years, I have worked at NJ Courts as a junior developer supporting and upgrading internal applications used by staff at the courts. I have been involved in developing for both backend and frontend using Java and JSF.\n\nI also have lots of fun using JavaScript and libraries like React, and have built numerous projects, including this portfolio site, using JavaScript. My go-to cloud provider is AWS, and I have a certified cloud practitioner certification with plans of expanding my skills with other AWS certifications.',
        'tech-skills': 'I am proficient in JavaScript, React, Node.js, Express, Java EE, JSF. I have experience administering and/or configuring AWS resources like EC2, S3, IAM, SES, Route 53. I also have a strong understanding of RESTful APIs and web services.',
        'soft-skills': 'I bring strong problem-solving skills, teamwork, and communication to every project. I am adaptable, persistent, and always eager to learn and improve.'
      }
    },
    user: {
      sectionName: 'personal',
      defaultSection: 'hobbies',
      textContent: {
        'hobbies': 'In my free time, I enjoy learning about financial markets and instruments, gaming with my friends, and spending time outdoors and exploring nature.',
        'values': 'Integrity, having curiosity in everything I do, strong moral compass. A few motos and life lessons I hold myself to: \n\nGrowth is not linear. \nThe harder you work, the luckier you get. \nNever criticize, condemn, or complain.',
        'goals': 'I believe that materialistic goals are strong impulsive drivers but also equally as shallow. So I use short term materialistic goals to make progress towards more meaningful goals like becoming a better person, spiritually, physically, and emotionally.'
      }
    },
    gamepad: {
      sectionName: 'hobbies',
      defaultSection: 'finance',
      textContent: {
        'finance': "I've been learning the ins and outs of the financial markets and instruments for around seven years now. \n I've found a special interest in cryptocurrency and the niche of trading options contracts.",
        'gaming': "From racing games to MOBAs, I enjoy gaming as a way to unwind, enjoy immersive storytelling, grow my strategic thinking skills and reflexes. Currently I'm most excited about the launch of GTA 6.\n\nSome of my most played and enjoyed games: \nLeague of Legends\nMinecraft\nNeed for Speed: Underground 2\nForza Horizon\nGTA 5\nRed Dead Redemption 2\nKerbal Space Program\n",
        'outdoors': 'Hiking, biking, and spontaneous road trips keep me energized and connected to nature. I love playing sports like Volleyball, Badminton, and Basketball.'
      }
    }
  };

  return (
    <div className="about-container">
      <div className="button-column">
        {Object.keys(sections).map((section) => (
          <button
            key={section}
            className={activeSection === section ? 'button active' : 'button'}
            onClick={() => setActiveSection(section)}
          >
            <FontAwesomeIcon icon={section === 'terminal' ? faTerminal : section === 'user' ? faUser : faGamepad} size="lg" />
          </button>
        ))}
      </div>
      <div className="content-column">
        <SectionComponent
          sectionName={sections[activeSection].sectionName}
          textContent={sections[activeSection].textContent}
          defaultSection={sections[activeSection].defaultSection}
          classPrefix={sections[activeSection].sectionName}
        />
      </div>
      <div className="code-snippet-column">
        <CodeShowcase />
      </div>
    </div>
  );
};

export default AboutPage;
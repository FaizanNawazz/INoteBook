import React from 'react';
import { useContext } from 'react';
import NoteContext from '../context/notes/NoteContext';
// rafc

const About = () => {
    const a = useContext(NoteContext);
  return (
    <div>
      this is about {a.name} and he is in class {a.class}
    </div>
  )
}

export default About

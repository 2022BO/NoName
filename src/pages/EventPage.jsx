import React, { useState, useEffect } from 'react';
import { Box, Text, Container, Button, Image, ListItem, UnorderedList, Heading} from '@chakra-ui/react';
import styles from './StylePage';
import AddCourse from './AddCourse';
import { useParams } from 'react-router-dom';
import { CourseDetail } from '../components/CourseDetail';



const EditedDataView = ({ editedData, handleAddCourseClick, handleDeleteCourse }) => (
  <Box>
    <Box style={styles.box}>
      <Text fontSize="lg">Titel: {editedData.title}</Text>
      <Text>Omschrijving: {editedData.description}</Text>
      <Text>Starttijd: {editedData.startTime}</Text>
      <Text>Eindtijd: {editedData.endTime}</Text>
      <Text>Categorieën: {editedData.categories?.join(', ')}</Text>
      <Text>Docent: {editedData.instructor?.name}</Text>
      {editedData.instructor?.image && (
        <Image
          src={editedData.instructor?.image}
          alt={editedData.instructor?.name}
          style={styles.image}
        />
      )}
    </Box>
    <Box style={{ ...styles.box, display: 'flex', justifyContent: 'space-between' }}>
      <Button onClick={handleAddCourseClick} style={styles.editButton}>
        Cursus toevoegen
      </Button>
      <Button
        colorScheme="red"
        variant="outline"
        onClick={() => {
          if (window.confirm('Are you sure you want to delete this course?')) {
            handleDeleteCourse(editedData.id);
          }
        }}
      >
        Verwijder
      </Button>
    </Box>
  </Box>
);


export const EventPage = () => {
  const { courseId } = useParams();
  console.log('Event ID:', courseId);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);

  const handleUpdateCourses = (newCourse) => {
    console.log('handleUpdateCourses', newCourse); 
  };

  useEffect(() => {
    console.log('Selected Course:', selectedCourse);
    setEditedData(selectedCourse || {});
  }, [selectedCourse]);

  const handleEditClick = (editedData) => {
    setFormOpen(true);
    setEditMode(true);
    setEditedData(editedData);
    setSelectedCourse(editedData);
  };

  const handleAddCourseClick = () => {
    setEditMode(true);
    setFormOpen(true);
    setEditedData({});
    setSelectedCourse(null);
  };

  const handleSaveChanges = async (editedData) => {
    console.log('Trying to save changes for course:', editedData);
  
    try {
      const response = await fetch(`/api/courses/${editedData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });
  
      if (response.ok) {
        setEditMode(false);
      } else {
        console.error('Failed to save course changes. Server returned:', response);
      }
    } catch (error) {
      console.error('Error saving course changes:', error);
    }
  };
  
  return (
    <div>
    <Box style={styles.pageContainer}>
      <Container style={{ ...styles.container}}>{selectedCourse && (
  <Box mt={4}>
    
    <CourseDetail course={selectedCourse} />
  </Box>
)}
        <Box style={styles.container}>
          <h1><strong>Welkom bij de Cursusbeheer Pagina!</strong></h1>
          <Text mb={4}>
            Op deze pagina kun je eenvoudig nieuwe cursussen toevoegen aan het Leren & Ontwikkelen in de GGZ-platform.
            Hier zijn de stappen om een cursus toe te voegen:
          </Text>
          <Text mb={4}>
            Ontdek hier hoe je nieuwe cursussen kunt toevoegen en beheren op het platform voor Leren & Ontwikkelen in de GGZ.
          </Text>
          <Text mb={4}>
            Leer hoe je eenvoudig relevante informatie invoert en je bijdrage levert aan een groeiende educatieve community!
          </Text>
          <UnorderedList>
            <ListItem style={{ fontSize: '1em', fontWeight: 'bold' }}>
              Navigeer naar "Cursus Toevoegen"
              <Text mb={2} style={{ fontWeight: 'normal', fontSize: 'inherit' }}>
                Klik op de knop "Cursus Toevoegen" om te beginnen met het invoeren van gegevens voor je nieuwe cursus.
              </Text>
            </ListItem>
            <ListItem style={{ fontSize: '1em', fontWeight: 'bold' }}>
              Vul de Cursusinformatie in
              <Text mb={2} style={{ fontWeight: 'normal', fontSize: 'inherit' }}>
                Voer de vereiste gegevens in, zoals titel, beschrijving, starttijd, eindtijd, categorieën, instructeur en instructeursafbeelding.
                Je kunt optionele velden ook invullen om meer details toe te voegen.
              </Text>
            </ListItem>
            <ListItem style={{ fontSize: '1em', fontWeight: 'bold' }}>
              Kies Categorieën"
              <Text mb={2} style={{ fontWeight: 'normal', fontSize: 'inherit' }}>
                Selecteer de relevante categorieën voor je cursus, zoals "geestelijke gezondheid", "kind en jeugd" of "professionele ontwikkeling".
              </Text>
            </ListItem>
            <ListItem style={{ fontSize: '1em', fontWeight: 'bold' }}>
              Docent informatie
              <Text mb={2} style={{ fontWeight: 'normal', fontSize: 'inherit' }}>
                Voer de naam van de instructeur in en voeg indien mogelijk een afbeelding toe voor een persoonlijk tintje.
              </Text>
            </ListItem>
            <ListItem style={{ fontSize: '1em', fontWeight: 'bold' }}>
              Bewaar je Nieuwe Cursus
              <Text mb={2} style={{ fontWeight: 'normal', fontSize: 'inherit' }}>
                Klik op "Opslaan" om je nieuwe cursus aan het platform toe te voegen.
              </Text>
            </ListItem>
            <ListItem style={{ fontSize: '1em', fontWeight: 'bold' }}>
              Bekijk je resultaat
              <Text mb={2} style={{ fontWeight: 'normal', fontSize: 'inherit' }}>
                Zodra opgeslagen, kun je de details van je nieuwe cursus bekijken op de hoofdpagina.
              </Text>
              <Text mb={2} style={{ fontWeight: 'normal', fontSize: 'inherit', fontStyle: 'italic'}}>
              Zodra je het cursusformulier hebt ingevuld, nemen we zo snel mogelijk contact met je op om alle
        details met betrekking tot locatie, prijs, website en een inspirerende quote met je te bespreken.
        We kijken ernaar uit om samen met jou aan je leerreis te beginnen!
              </Text>
            </ListItem>
          </UnorderedList>
        </Box>
       
        {editMode ? (
          <EditedDataView
            editedData={editedData}
            handleAddCourseClick={handleAddCourseClick}
            handleDeleteCourse={handleDeleteCourse}
          />
        ) : (
          <AddCourse
            handleUpdateCourses={handleUpdateCourses}
            isOpen={isFormOpen}
            onClose={() => setFormOpen(false)}
            onSave={handleSaveChanges}
            data={selectedCourse}
          />
        )}
      </Container>
    </Box>
    </div>
  );
};
export default EventPage;

//•	The user can click on an event that leads them to the ‘Event’ page using React Router.
//•	A query to add the event to the server is sent as well. 
//•	A succes or fail message is shown after a successful update.
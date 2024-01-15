import React, { useState, useEffect } from 'react';
import { Box, Text, Container, Button, Image } from '@chakra-ui/react';
import styles from './StylePage';
import AddCourse from './AddCourse';
import { CourseDetail } from '../components/CourseDetail';

export const CoursePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateCourses = (newCourse) => {
    console.log('handleUpdateCourses', newCourse);
  };

  useEffect(() => {
    setEditedData(selectedCourse || {});
  }, [selectedCourse]);

  useEffect(() => {
    // Laadlogica
    const fetchData = async () => {
      if (selectedCourse) {
        setIsLoading(true);

        try {
          const response = await fetch(`https://my-json-server.typicode.com/2022BO/NoName/courses/${selectedCourse.id}`);

          if (response.ok) {
            const course = await response.json();
            setEditedData(course);
          } else {
            console.error('Failed to fetch course data. Server returned:', response);
          }
        } catch (error) {
          console.error('Error fetching course data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedCourse]);

  const handleAddCourseClick = () => {
    setEditMode(true);
    setFormOpen(true);
    setEditedData('');
    setSelectedCourse(null);
  };

  const handleSaveChanges = async (editedData) => {
    console.log('Trying to save changes for course:', editedData);

    try {
      const response = await fetch(`https://my-json-server.typicode.com/2022BO/NoName/courses/${editedData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });

      if (response.ok) {
        handleUpdateCourses(editedData);
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
        <Container style={{ ...styles.container }}>
          {selectedCourse && (
            <Box mt={4}>
              <CourseDetail course={selectedCourse} />
            </Box>
          )}

          {isLoading && <p>Loading...</p>}

          {editMode ? (
            <Box>
              {/* Render de bewerkte gegevens */}
              <Box style={styles.box}>
                <Text fontSize="lg">Titel: {editedData.title}</Text>
                <Text>Omschrijving: {editedData.description}</Text>
                <Text>Starttijd: {editedData.startTime}</Text>
                <Text>Eindtijd: {editedData.endTime}</Text>
                <Text>Categorieën: {editedData.categories?.join(', ')}</Text>
                <Text>Docent: {editedData.instructor?.name}</Text>
                {editedData.instructor?.image && (
                  <Image  loading="lazy" src={editedData.instructor?.image} alt={editedData.instructor?.name} style={styles.image} />
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
          ) : (
            // Render de cursus toevoegen / bewerken formulier
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

export default CoursePage;


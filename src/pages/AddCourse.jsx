import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardHeader, CardBody, CardFooter, Heading, FormControl, FormLabel, FormHelperText, Textarea, Text, Input, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, ModalCloseButton } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import Footer from '../components/Footer';

const AddCourse = ({ handleUpdateCourses }) => {
  const navigate = useNavigate();
  if (!handleUpdateCourses) {
    return null; 
  }
  const toast = useToast();
  const styles = {
    modalContent: {
      background: 'linear-gradient(to right, #3498db, #2ecc71)',
      color: '#fff',
      borderRadius: '8px',
    },
  };
  const [courses, setCourses] = useState([]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    email: "",
    phone: "",
    message: "",
    instructor: { name: "", image: "" },
    categories: [],
  });

  const handleShowNotification = (message, status) => {
    toast({
      title: message,
      status: status, // 'success' or 'error'
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSaveChanges = async () => {
    try {
      let newCourse;

      if (typeof handleUpdateCourses === 'function') {// Haal gegevens op van de server
        const response = await fetch('https://my-json-server.typicode.com/2022BO/NoName/courses', {
  method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });

        if (response.ok) {
          // Parse de response wanneer deze succesvol is
          newCourse = await response.json();
          handleUpdateCourses(newCourse);

          setCourses((prevCourses) => [...prevCourses, newCourse]);

          setCourseData({
            title: "",
            image: "",
            description: "",
            startTime: "",
            endTime: "",
            instructor: { name: "", image: "" },
            categories: [],
          });

          setTimeout(() => {
            setFormOpen(false);
          }, 500);

          // Toon een succes-toast
          toast({
            title: "Cursus opgeslagen",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

           // Navigeer terug naar CoursePage.jsx
           navigate('/');     
        } else {
          console.error('Failed to add course. Server returned:', response);

          // Toon een fout-toast
          handleShowNotification("Fout bij opslaan cursus", "error");
          toast({
            title: "Fout bij opslaan cursus",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error('Error adding course:', error);
      const errorMessage = error.message || 'Oops! Er ging iets mis.';

      // Toon een fout-toast
      handleShowNotification(errorMessage, "error");
      toast({
        title: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleNavigation = () => {
    navigate('/add-course-form');
  };

  return (
    <Box style={styles.pageContainer}>
 <Card align='center' style={{...styles.box, marginBottom: '10px' }}>
  <CardHeader>
  <Heading size='md' style={styles.heading}>
  Cursus Aanmelden
        </Heading>
  </CardHeader>
  <Box mb="1" style={{ display: 'flex', justifyContent: 'center' }}>
    <Image
    loading="lazy"
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRITBUgze1LUFdU2yYAkcZ5C0td8NpWLEm9TvVHYfptuXPOzPt8nbik1E1fS-d-B2EmYSY&usqp=CAU&nf_resize=fit&w=300&h=400"
      alt="krijttekening in een les"
      style={styles.imageStyle}
    />
    </Box>
  <CardBody>
    <Text> Vul het onderstaande formulier in om je cursus aan te melden. We nemen contact met je op voor verdere details en goedkeuring.</Text>
    <Text> Als je meer informatie wil over je de cursus kan toevoegen kijk bij de Informatie contact pagina </Text>
   
  </CardBody>
  <CardFooter>
  <Button
    style={{
      ...styles.cancelButton,
      backgroundColor: '#4CAF50', 
      color: '#fff', 
      margin: 'auto',
      display: 'block',
      marginTop: '16px',
    }}
    onClick={() => {
      setFormOpen(true);
    }}
  >
    Aanmeldformulier invullen
  </Button>
</CardFooter>
</Card>

{isFormOpen && (
  <Modal isOpen={true} onClose={() => setFormOpen(false)}>
    <ModalOverlay />
    <ModalContent sx={styles.modalContent}>
      <ModalHeader>Cursusformulier</ModalHeader>
      <ModalCloseButton />
              <ModalBody>
                <FormControl isRequired>
                  <FormLabel>Titel</FormLabel>
                  <Input
                    placeholder="Vul in Title"
                    value={courseData.title || ''}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  />
                </FormControl>
                <FormControl>
              <FormLabel>Afbeeldings-URL van de cursus</FormLabel>
              <Input
  type="text"
  name="image"
  placeholder="Vul in afbeeldings-URL"
  value={courseData.image || ''}
  onChange={(e) => setCourseData({...courseData,image: e.target.value})}
/>
            </FormControl>
  <FormControl isRequired>
    <FormLabel>Omschrijving</FormLabel>
    <Textarea
      placeholder='Vul in Description'
      value={courseData.description || ''}
      onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
    />
  </FormControl>

  <FormControl isRequired>
    <FormLabel>Starttijd</FormLabel>
    <Input
      placeholder='Vul in Starttijd'
      value={courseData.startTime || ''}
      onChange={(e) => setCourseData({ ...courseData, startTime: e.target.value })}
    />
  </FormControl>

  <FormControl isRequired>
    <FormLabel>Eindtijd</FormLabel>
    <Input
      placeholder='Vul in Eindtijd'
      value={courseData.endTime || ''}
      onChange={(e) => setCourseData({ ...courseData, endTime: e.target.value })}
    />
  </FormControl>

<FormControl isRequired>
  <FormLabel>Categorieën</FormLabel>
  <FormHelperText fontSize="xs" color="white.500">
    Kies: "geestelijke gezondheid", "kind en jeugd", "professionele ontwikkeling"
  </FormHelperText>
</FormControl>
<Input
  placeholder='Vul in categorieën in, gescheiden door een komma'
  value={Array.isArray(courseData.categories) ? courseData.categories.join(',') : ''}
  onChange={(e) => setCourseData({ ...courseData, categories: e.target.value.split(',') || [] })} 
/>

<FormControl isRequired>
          <FormLabel>Docent naam</FormLabel>
          <Input
            placeholder='Vul in Docent naam'
            value={courseData.instructor.name || ''}
            onChange={(e) =>
              setCourseData({
                ...courseData,
                instructor: { ...courseData.instructor, name: e.target.value },
              })
            }
          />
</FormControl>
<FormControl>
          <FormLabel>Docent afbeelding</FormLabel>
          <Input
            placeholder='Voeg toe afbeelding docent URL'
            value={courseData.instructor.image || ''}
            onChange={(e) =>
              setCourseData({
                ...courseData,
                instructor: { ...courseData.instructor, image: e.target.value },
              })
            }
          />
  </FormControl> 

  <FormControl isRequired>
  <FormLabel>E-mail</FormLabel>
  <Input
    placeholder="Vul in email"
    value={courseData.email || ''}
    onChange={(e) => setCourseData({ ...courseData, email: e.target.value })}
  />
</FormControl>

<FormControl>
  <FormLabel>Telefoonnummer</FormLabel>
  <Input
   placeholder="Vul in tel"
    value={courseData.phone || ''}
    onChange={(e) => setCourseData({ ...courseData, phone: e.target.value })}
  />
</FormControl>

    
<FormControl>
  <FormLabel>Bericht</FormLabel>
  <Textarea
  placeholder="Notities"
    value={courseData.message|| ''}
    onChange={(e) => setCourseData({ ...courseData, message: e.target.value })}
  />
</FormControl>

                </ModalBody>
              <ModalFooter mt={4} style={{ justifyContent: "space-between" }}>
                <Button
                  colorScheme="blue"
                  onClick={handleSaveChanges}
                >
                  Opslaan
                </Button>
                <Button
                  colorScheme="red"
                  variant="outline"
                  ml={4}
                  onClick={() => setFormOpen(false)}
                >
                  Annuleer
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
        <Footer /> 
    </Box>
  );
};

export default AddCourse;                


          



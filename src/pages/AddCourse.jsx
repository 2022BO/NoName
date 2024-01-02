import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Textarea,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";


const AddCourse = ({handleUpdateCourses}) => {
  const toast = useToast();
  const styles = {
    pageContainer: {
      background: 'linear-gradient(to right, #3498db, #2ecc71)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px', 
    },
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
    startTime: "",
    endTime: "",
    email: "",
    phone: "",
    message: "",
    instructor: { name: "", image: "" },
    categories: [],

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const { title, image, description, startTime, endTime, instructor, categories } = courseData;
      
      const response = await fetch(`http://localhost:3000/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
  
      if (response.ok) {
        const newCourse = await response.json();
        console.log('Succesvolle toevoeging van de cursus');
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
      } else {
        console.error('Failed to add course. Server returned:', response);
  
        // Toon een fout-toast
        toast({
          title: "Fout bij opslaan cursus",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error adding course:', error);
  
      // Toon een fout-toast
      toast({
        title: "Oops! Er ging iets mis.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  
  };
  
  return (
    
    <Box style={styles.pageContainer}>
      <div>
      <a id="add-course-form" tabIndex="-1" style={{ visibility: 'hidden' }}></a>
      <Button
  style={{ margin: "auto", display: "block", marginTop: "16px" }}
  onClick={() => {
    console.log("Opening form");
    setFormOpen(true);
  }}
>
  Ga naar cursusformulier
</Button>
{isFormOpen && (
  <Modal isOpen={true} onClose={() => setFormOpen(false)}>
    <ModalOverlay />
    <ModalContent sx={styles.modalContent}>
      <ModalHeader>Cursus formulier</ModalHeader>
      <ModalCloseButton />
              <ModalBody>
                <FormControl isRequired>
                  <FormLabel>Titel</FormLabel>
                  <Input
                    placeholder="Vul in Title"
                    value={courseData.title}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  />
                </FormControl>
                <FormControl>
              <FormLabel>Afbeeldings-URL van de cursus</FormLabel>
              <Input
  type="text"
  name="image"
  placeholder="Vul in afbeeldings-URL"
  value={courseData.image}
  onChange={(e) => setCourseData({...courseData,image: e.target.value})}
/>
            </FormControl>
  <FormControl isRequired>
    <FormLabel>Omschrijving</FormLabel>
    <Textarea
      placeholder='Vul in Description'
      value={courseData.description}
      onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
    />
  </FormControl>

  <FormControl isRequired>
    <FormLabel>Starttijd</FormLabel>
    <Input
      placeholder='Vul in Starttijd'
      value={courseData.startTime}
      onChange={(e) => setCourseData({ ...courseData, startTime: e.target.value })}
    />
  </FormControl>

  <FormControl isRequired>
    <FormLabel>Eindtijd</FormLabel>
    <Input
      placeholder='Vul in Eindtijd'
      value={courseData.endTime}
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
  value={courseData.categories.join(',')}
  onChange={(e) => setCourseData({
    ...courseData,
    categories: e.target.value.split(','),
  })}
/>
<FormControl isRequired>
          <FormLabel>Docent naam</FormLabel>
          <Input
            placeholder='Vul in Docent naam'
            value={courseData.instructor.name}
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
            value={courseData.instructor.image}
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
    value={courseData.email}
    onChange={(e) => setCourseData({ ...courseData, email: e.target.value })}
  />
</FormControl>

<FormControl>
  <FormLabel>Telefoonnummer</FormLabel>
  <Input
   placeholder="Vul in tel"
    value={courseData.phone}
    onChange={(e) => setCourseData({ ...courseData, phone: e.target.value })}
  />
</FormControl>

    
<FormControl>
  <FormLabel>Bericht</FormLabel>
  <Textarea
  placeholder="Notities"
    value={courseData.message}
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
      </div>
    </Box>
  );
};

export default AddCourse;                



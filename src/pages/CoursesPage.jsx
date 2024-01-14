import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import AddCourse from './AddCourse';
import { CourseDetail } from '../components/CourseDetail';
import { TimeIcon, ArrowUpIcon, SearchIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import styles from './StylePage';
import { useToast } from '@chakra-ui/react';
import Footer from '../components/Footer';
import {
  Heading,
  Box,
  Button,
  Center,
  VStack,
  Text,
  Input,
  Image,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
} from '@chakra-ui/react';


const CoursesPage = ({}) => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [invalidInput, setInvalidInput] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [data, setData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const toast = useToast();


  useEffect(() => {
    if (data && data.courses) {
      const cleanedCourses = data.courses.map((course) => ({
        ...course,
        categories: course.categories.map((category) => category.replace(/"/g, '').trim()),
      }));

      setCourses(cleanedCourses);
    }
    if (data && data.categories) {
      setCategories(data.categories);
    }
  }, [data]);

  useEffect(() => {
    fetch('/db.json')
      .then((response) => response.json())
      .then((jsonData) => {
        console.log('Received data:', jsonData);
        setData(jsonData);
        setFilteredCourses(jsonData.courses || []);
      })
      .catch((error) => console.error('Error fetching JSON data:', error));
  }, []);

  const availableCourses = (course) => {
    const matchesCategory = !selectedCategory || course.categories.includes(selectedCategory);
  
    const matchesSearch = courses.filter((c) => {
      return (
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  
    return matchesCategory && matchesSearch.length > 0; 
  };
  
  const handleSearch = () => {
    setFilteredCourses(courses);
  
    const newFilteredCourses = courses.filter((course) => {
      const matchesCategory =
        selectedCategory === '' ||
        course.categories.some(
          (category) => category.toLowerCase() === selectedCategory.toLowerCase()
        );
  
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.categories.some((category) =>
          category.toLowerCase().includes(searchQuery.toLowerCase())
        );
  
      return matchesCategory && matchesSearch;
    });
  
    setFilteredCourses(newFilteredCourses);
    setInvalidInput(newFilteredCourses.length === 0);
  };

  const handleCourseSelection = (course) => {
    try {
      setSelectedCourse(course);
      console.log('Selected Category:', selectedCategory);
    } catch (error) {
      console.error('Error selecting course:', error);
    }
  };
  const filterByCategory = (course) => {
    return (
      selectedCategoryId === '' ||
      course.categories.some((category) => category === selectedCategoryId)
    );
  };

  const handleAddCourseClick = () => {
    navigate('/add-course-form');
    setFormOpen(true);
    setSelectedCourse(null);
  };

  const handleUpdateCourses = (newCourse) => {
    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    setNotification('Cursus succesvol toegevoegd/verwijderd');
    navigate('/');
  };
  const handleDeleteCourse = async (courseId) => {
    const isConfirmed = window.confirm('Weet je 100% zeker dat je deze cursus wilt verwijderen?');
    if (!isConfirmed) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/courses/${courseId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Update courses state
        setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
        // Update filteredCourses state
        setFilteredCourses((prevFilteredCourses) => prevFilteredCourses.filter((course) => course.id !== courseId));
  
        setSelectedCourse(null);
        handleShowNotification('Cursus succesvol verwijderd', 'success');
        navigate('/');
      } else {
        console.error('Failed to delete course. Server returned:', response);
        handleShowNotification('Fout bij het verwijderen van de cursus', 'error');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      handleShowNotification('Fout bij het verwijderen van de cursus', 'error');
    }
  };
  
  const handleShowNotification = (message, status) => {
    toast({
      title: message,
      status: status,
      duration: 5000,
      isClosable: true,
    });
  };

  const filteredCoursesByCategory = filteredCourses.filter(filterByCategory);

  return (
    <Center h="100%" flexDir="column" style={{ ...styles.pageContainer }}>
      <Box style={styles.box}>
        <Heading style={styles.heading}>Leren & Ontwikkelen in de GGZ</Heading>
        {invalidInput && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={3} style={{ padding: '10px' }}>
              Oeps!
            </AlertTitle>
            <AlertDescription>
              <strong>Wat kun je doen?</strong>
              <ul>
                <li>Controleer de spelling van je zoekopdracht</li>
                <li>Probeer een andere zoekopdracht</li>
                <li>Ga naar informatie en contact</li>
              </ul>
            </AlertDescription>
          </Alert>
          
        )}
        
        <VStack spacing={3} align={'stretch'} p={4}>
          <Select
            placeholder="Filter op categorie"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Alle categorieën</option>
            {data &&
              data.categories &&
              data.categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
          </Select>
          <Input
            type="text"
            placeholder="Vul cursusnaam in..."
            value={searchQuery}
            onChange={(e) => {
              console.log('Input Change Event:', e.target.value);
              setSearchQuery(e.target.value);
            }}
          />
          <Button colorScheme="blue" mt={2} onClick={handleSearch}>
            Zoeken <SearchIcon ml="auto" />
          </Button>

          <Flex
            wrap="wrap"
            justify="space-between"
            align="stretch"
            spacing={4}
            direction={{ base: 'column', md: 'row' }}
          >
{filteredCoursesByCategory.map((course) => (
 <React.Fragment key={course.id}>
  <Box borderWidth="1px" borderRadius="lg" overflow="hidden" position="relative" padding={3} mt={2} width={{ base: '100%', md: '30%' }} mx={{ base: 0, md: 3 }}>
    <img src={course.image} alt={course.title} style={styles.image} />

    <Box>
      <Text as="h3" fontSize="lg" fontWeight="bold" color="blue.500" mb={2}>
        {course.title}
      </Text>
      <Box mb={2}>
        <Text>
          <strong>Omschrijving:</strong> {course.description || "Informatie niet beschikbaar"}
        </Text>
      </Box>
      <Text>
        <TimeIcon marginRight="5px" />
        <strong>Starttijd:</strong> {course.startTime || "Informatie niet beschikbaar"}
      </Text>
      <Text>
        <TimeIcon marginRight="5px" />
        <strong>Eindtijd:</strong> {course.endTime || "Informatie niet beschikbaar"}
      </Text>
      <Text>
        <strong>Categorieën:</strong> {course.categories ? course.categories.join(', ') : 'N/A'}
      </Text>
      <Text>
  <strong>Docent:</strong> {course.instructor?.name || "Informatie niet beschikbaar"}
</Text>
<Box mb={2} style={{ marginBottom: '50px' }}>
  <Text>
    {course.instructor?.image && (
      <Image
        boxSize="50px"
        src={course.instructor?.image}
        alt={course.instructor?.name}
        style={styles.imageInstrutor}
      />
    )}
  </Text>
  <Box mt={1} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: 8, width: '85%' }}>
  <Link to={`/course-page/${course.id}`} style={{ flex: '1' }}>
    <Button colorScheme="blue" variant="outline" mr={2} height="30px">
      Selecteer
    </Button>
  </Link>

  <Button
    colorScheme="red"
    variant="outline"
    onClick={() => handleDeleteCourse(course.id)}
    height="30px"
  >
    Verwijder
  </Button>
</Box>
</Box>
</Box>
    </Box>
    </React.Fragment>
))}
          </Flex>
        </VStack>
        {selectedCourse && (
          <Box mt={4}>
            <Heading fontSize="xl">Geselecteerde Cursus</Heading>
            <CourseDetail course={selectedCourse} />
          </Box>
        )}
        <Box
          style={{
            ...styles.box,
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          
          <Button colorScheme="blue" variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ marginBottom: '20px' }}>
            <Text mr={2}>Terug naar boven</Text>
            <ArrowUpIcon ml="auto" />
          </Button>
        </Box>
        <Navigation setFormOpen={setFormOpen} handleAddCourseClick={handleAddCourseClick} />
        <Box style={{ ...styles.box, display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'flex-start' }}></Box>
        <Footer />
      </Box>
      {isFormOpen && (
        <AddCourse isOpen={isFormOpen} onClose={() => setFormOpen(false)} handleUpdateCourses={handleUpdateCourses} handleAddCourseClick={handleAddCourseClick} />
      )}
    </Center>
  
  );
};

export default CoursesPage;

import React, { useEffect, useState } from 'react';
import { Box, Image, VStack, Text, HStack, Button } from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import { Link, useParams } from 'react-router-dom';
import styles from '../pages/StylePage';

export const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) {
      return;
    }

    let ignore = false;
    setError(null);

    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3000/courses/${courseId}`);

        if (response.ok) {
          const course = await response.json();
          if (!ignore) {
            setCourse(course);
            setIsLoading(false);
          }
        } else {
          setError(`Something went wrong: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [courseId]);

  

  if (error) {
    return <p>{error}</p>;
  }

  if (!course) {
    return null;
  }

  const { title, description, image, categories, startTime, endTime, instructor, location, prijs, website, quote } = course;
  const categoriesContent = categories ? categories.join(', ') : 'N/A';

  if (!instructor) {
    return <p>Instructor information not available</p>;
  }

  return (
    <Link to={`/course/${course.id}`}>
      <Box maxW="xl" mx="auto" my="4" p="4" borderWidth="1px" borderRadius="lg" overflow="hidden" bgColor="#8AC7DE" boxShadow="lg">
        <VStack spacing="4" align="start">
          <Text fontSize="xl" fontWeight="bold">
            Geselecteerde Cursus
          </Text>
          <Text as="h3" fontSize="lg" fontWeight="bold" color="blue.500" mb={2}>
            {title}
          </Text>
          <Text>
            <strong>Omschrijving:</strong> {description}
          </Text>
          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>
              <strong>Categorieën:</strong> {categoriesContent}
            </Text>
          </Box>
          <Image src={image} alt={title} style={{ ...styles.image, marginBottom: '10px' }} />
          <Box>
            <Text>
              <TimeIcon marginRight="5px" />
              <strong>Starttijd:</strong> {startTime}
            </Text>
            <Text>
              <TimeIcon marginRight="5px" />
              <strong>Eindtijd:</strong> {endTime}
            </Text>
            <Text>
              <strong>Locatie:</strong> {location}
            </Text>
            <Text>
              <strong>Prijs:</strong> {prijs}
            </Text>
            <Text>
              <strong>Website:</strong> {website}
            </Text>
            <Text>
              <strong>Quote: </strong> {quote}
            </Text>
          </Box>
          <HStack spacing="2">
            <Text>
              <strong>Docent: </strong> {instructor?.name || 'Informatie niet beschikbaar'}
            </Text>
            {instructor?.image && <Image src={instructor.image} alt={instructor.name} style={styles.imageInstrutor} />}
          </HStack>
        </VStack>
        <Text fontSize="xl" fontWeight="bold">
      Schrijf je nu in:
    </Text>
    <div onClick={() => window.location.href = 'mailto:inschrijvingcursus@fakeEmail.nl'}>
  <Button colorScheme="blue" variant="outline" mt={2} mr={2} mb={2}>
    inschrijvingcursus@fakeEmail.nl
  </Button>
</div>
  </Box>
</Link>
  );
};


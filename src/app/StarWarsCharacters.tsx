'use client';
import { useState, useEffect } from 'react';
import { fetchStarWarsCharacters } from '../utils/fetchData';
import CharacterCard from '../components/CharacterCard';
import {
  Button,
  TextField,
  Container,
  Grid,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';

const StarWarsCharacters = () => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('');
  const [homeworldFilter, setHomeworldFilter] = useState<string>('');
  const [filteredCharacters, setFilteredCharacters] = useState<any[]>([]);
  const [homeworlds, setHomeworlds] = useState<any>({});

  
  useEffect(() => {
    const loadCharacters = async () => {
      setLoading(true);
      const data = await fetchStarWarsCharacters(page);

      const charactersWithHomeworlds = await Promise.all(
        data.results.map(async (character: any) => {
          let homeworldName = 'Unknown';
          if (character.homeworld && !homeworlds[character.homeworld]) {
            try {
              const homeworldRes = await fetch(character.homeworld);
              const homeworldData = await homeworldRes.json();
              homeworldName = homeworldData.name;
              homeworlds[character.homeworld] = homeworldName;
            } catch (error) {
              console.error('Failed to fetch homeworld:', error);
            }
          } else {
            homeworldName = homeworlds[character.homeworld];
          }

          return {
            ...character,
            homeworldName,
          };
        })
      );

      setCharacters((prev) => [...prev, ...charactersWithHomeworlds]);
      setLoading(false);
    };

    loadCharacters();
  }, [page]);

  useEffect(() => {
    const filtered = characters.filter((character) => {
      const matchesGender = genderFilter
        ? character.gender.trim().toLowerCase() === genderFilter.toLowerCase() && character.gender.trim().toLowerCase() !== 'n/a'
        : true;
      const matchesHomeworld = homeworldFilter ? character.homeworldName === homeworldFilter : true;
      return  matchesGender && matchesHomeworld;
    });

    setFilteredCharacters(filtered);
  }, [searchTerm, genderFilter, homeworldFilter, characters]);

  const displayCharacters = filteredCharacters.length > 0 || searchTerm || genderFilter || homeworldFilter
    ? filteredCharacters
    : characters;

  return (
    <Container className='py-20' maxWidth="lg">
      <Typography variant="h3" align="center" gutterBottom>
        Star Wars Characters
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Filter by Gender</InputLabel>
        <Select
          value={genderFilter}
          onChange={(e) => {
            setGenderFilter(e.target.value);
            setFilteredCharacters([]);
          }}
          label="Filter by Gender"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Filter by Homeworld Name</InputLabel>
        <Select
          value={homeworldFilter}
          onChange={(e) => {
            setHomeworldFilter(e.target.value);
            setFilteredCharacters([]);
          }}
          label="Filter by Homeworld"
        >
          <MenuItem value="">All</MenuItem>
          {Array.from(new Set(characters.map((char) => char.homeworldName))).map(
            (homeworldName) => (
              <MenuItem key={homeworldName} value={homeworldName}>
                {homeworldName}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
      <Grid container spacing={3}>
        {displayCharacters.length > 0 ? (
          displayCharacters.map((character) => (
            <Grid item xs={12} sm={6} md={4} key={character.name}>
              <CharacterCard character={character} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography align="center" variant="h6">
              No characters found for your search or filters
            </Typography>
          </Grid>
        )}
      </Grid>

      {displayCharacters.length > 0 && (
        <Button
          onClick={() => setPage(page + 1)}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 4 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Load More'}
        </Button>
      )}


    </Container>
  );
};

export default StarWarsCharacters;
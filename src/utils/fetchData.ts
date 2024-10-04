export const fetchStarWarsCharacters = async (page: number = 1) => {
    const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
    const data = await response.json();
    return data;
  };
  
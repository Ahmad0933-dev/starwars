import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  CircularProgress,
  Box
} from '@mui/material';
import { styled } from '@mui/system';

const StyledDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    padding: '20px',
    borderRadius: '12px',
  },
});

const CharacterProfileModal = ({ character, open, onClose }: { character: any, open: boolean, onClose: () => void }) => {
  const [films, setFilms] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFilms = async () => {
      setLoading(true);
      try {
        const filmTitles = await Promise.all(
          character.films.map(async (filmUrl: string) => {
            const response = await fetch(filmUrl);
            const filmData = await response.json();
            return filmData.title;
          })
        );
        setFilms(filmTitles);
      } catch (error) {
        console.error('Error fetching films:', error);
      } finally {
        setLoading(false);
      }
    };

    if (character.films.length > 0) {
      fetchFilms();
    }
  }, [character.films]);

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#1976d2' }}>
        {character.name}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ marginBottom: '8px' }}>
          <strong>Height:</strong> {character.height} cm
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '8px' }}>
          <strong>Weight:</strong> {character.mass} kg
        </Typography>

        <Typography variant="body1">
          <strong>Films:</strong>
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ul>
            {films.map((film: string, index: number) => (
              <li key={index}>{film}</li>
            ))}
          </ul>
        )}
      </DialogContent>
      <Button
        onClick={onClose}
        variant="contained"
        sx={{ marginTop: 2, backgroundColor: '#1976d2', color: '#fff' }}
      >
        Close
      </Button>
    </StyledDialog>
  );
};

export default CharacterProfileModal;

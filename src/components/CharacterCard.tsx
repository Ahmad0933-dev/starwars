import { useState } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box
} from '@mui/material';

import CharacterProfileModal from './CharacterProfileModal'; 
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: theme.spacing(2),
  boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));


const CharacterCard = ({ character }: { character: any }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <StyledCard>
        <CardActionArea onClick={handleClickOpen}>
          <CardMedia
            component="img"
            height="160"
            image={`https://robohash.org/${character.name}.png?set=set2`}
            alt={character.name}
            sx={{
              filter: 'brightness(0.9)',
            }}
          />
          <CardContent sx={{ backgroundColor: '#f5f5f5' }}>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              align="center"
              sx={{ color: '#333', fontWeight: 'bold' }}
            >
              {character.name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </StyledCard>

      <CharacterProfileModal
        character={character}
        open={open}
        onClose={handleClose}
      />
    </>
  );
};

export default CharacterCard;

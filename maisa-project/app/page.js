import Image from "next/image";
import styles from "./page.module.css";
import { Box, Card, CardContent, Typography, Chip, CircularProgress, Alert,Stack, Divider, Button } from '@mui/material';
import NumberWords from "./components/numberWords";

export default function Home() {

  return (
    
    <Box>
      <NumberWords />
    </Box>
  );
}

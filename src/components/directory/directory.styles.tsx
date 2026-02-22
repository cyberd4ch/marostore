import styled from 'styled-components';

export const DirectoryContainer = styled.div`
  width: 100%;
  display: grid;
  /* This creates 3 columns on desktop and 1 on mobile automatically */
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  
  /* Ensuring the last large items span properly if you have 5 items */
  & > *:nth-child(4),
  & > *:nth-child(5) {
    grid-column: span 1;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
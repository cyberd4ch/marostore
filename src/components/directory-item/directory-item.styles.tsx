import styled from 'styled-components';

export const BackgroundImage = styled.div<{ $imageUrl: string }>`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-image: ${({ $imageUrl }) => `url(${$imageUrl})`};
  transition: transform 1.2s cubic-bezier(0.25, 0.45, 0.45, 0.95);
`;

export const Body = styled.div`
  height: 90px;
  padding: 0 25px;
  display: flex;
  flex-col: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  opacity: 0.9;
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #f1f5f9;
  transition: all 0.3s ease;
`;

export const CategoryTitle = styled.h2`
  font-weight: 900;
  margin: 0 6px 0;
  font-size: 1.25rem;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: -0.05em;
`;

export const DirectoryItemContainer = styled.div`
  min-width: 30%;
  height: 500px; /* Taller items feel more "Fashion Studio" */
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  &:hover {
    ${BackgroundImage} {
      transform: scale(1.08);
    }

    ${Body} {
      opacity: 1;
      height: 110px; /* Slight expansion on hover */
    }
  }

  @media (max-width: 768px) {
    height: 400px;
  }
`;
'use client';

import { useNavigate } from 'react-router-dom'; // or 'next/navigation' depending on your setup
import {
    DirectoryItemContainer,
    BackgroundImage,
    Body,
    CategoryTitle
} from './directory-item.styles';

const DirectoryItem = ({ category }: { category: any }) => {
    const { imageUrl, title, route } = category;
    const navigate = useNavigate();

    const onNavigateHandler = () => navigate(route);

    return (
        <DirectoryItemContainer onClick={onNavigateHandler}>
            <BackgroundImage imageUrl={imageUrl} />
            <Body>
                <CategoryTitle>{title}</CategoryTitle>
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                    Explore Collection
                </p>
            </Body>
        </DirectoryItemContainer>
    );
};

export default DirectoryItem;
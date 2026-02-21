import { FC } from 'react';
import { useRouter } from 'next/navigation';

import { DirectoryCategory } from '../directory/directory.component';

import {
    BackgroundImage,
    Body,
    DirectoryItemContainer,
} from './directory-item.styles';

type DirectoryItemProps = {
    category: DirectoryCategory;
};

const DirectoryItem: FC<DirectoryItemProps> = ({ category }) => {
    const { imageUrl, title, route } = category;
    const router = useRouter();

    const onNavigateHandler = () => router.push(route);

    return (
        <DirectoryItemContainer onClick={onNavigateHandler}>
            <div
                className="background-image"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <Body>
                <h2>{title}</h2>
                <p>Shop Now</p>
            </Body>
        </DirectoryItemContainer>
    );
};

export default DirectoryItem;
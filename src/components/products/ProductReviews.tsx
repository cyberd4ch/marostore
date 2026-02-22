'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface Review {
    id: number;
    author: string;
    rating: number;
    date: string;
    comment: string;
}

interface ProductReviewsProps {
    rating: number;
    reviewCount: number;
    reviews: Review[];
}

export default function ProductReviews({
    rating,
    reviewCount,
    reviews,
}: ProductReviewsProps) {
    return (
        <div>
            {/* Rating summary */}
            <div className="flex items-center gap-4 mb-8">
                <span className="text-5xl font-bold">{rating}</span>
                <div>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    'w-5 h-5',
                                    i < Math.round(rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                )}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Based on {reviewCount} reviews
                    </p>
                </div>
            </div>

            {/* Individual reviews */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <Card key={review.id}>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <Avatar>
                                    <AvatarFallback>
                                        {review.author.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">{review.author}</h4>
                                        <span className="text-sm text-muted-foreground">
                                            {review.date}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn(
                                                    'w-4 h-4',
                                                    i < review.rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="mt-2 text-muted-foreground">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
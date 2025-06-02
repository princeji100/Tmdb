import { useState, useEffect } from 'react';

export function useActorDetails(actorId) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActor = async () => {
            setLoading(true); // Set loading at the start
            try {
                // Check if actorId exists
                if (!actorId) {
                    setError('No actor ID provided');
                    setLoading(false);
                    return;
                }

                const [personRes, creditsRes, externalIdsRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/person/${actorId}?language=en-US`, {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                            accept: 'application/json',
                        },
                    }),
                    fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/person/${actorId}/movie_credits?language=en-US`, {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                            accept: 'application/json',
                        },
                    }),
                    fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/person/${actorId}/external_ids?language=en-US`, {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                            accept: 'application/json',
                        },
                    })
                ]);

                // Check for response errors
                if (!personRes.ok || !creditsRes.ok || !externalIdsRes.ok) {
                    throw new Error('Failed to fetch actor data');
                }

                const [personData, creditsData, externalIds] = await Promise.all([
                    personRes.json(),
                    creditsRes.json(),
                    externalIdsRes.json()
                ]);

                // Transform the data with error handling
                const transformedData = {
                    id: personData.id,
                    name: personData.name,
                    photo: personData.profile_path
                        ? `https://image.tmdb.org/t/p/w500${personData.profile_path}`
                        : '/placeholder-avatar.jpg',
                    backdrop: creditsData.cast[0]?.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${creditsData.cast[0].backdrop_path}`
                        : '/placeholder-backdrop.jpg',
                    biography: personData.biography || 'No biography available.',
                    birthDate: personData.birthday
                        ? new Date(personData.birthday).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                        : 'Unknown',
                    birthPlace: personData.place_of_birth || 'Unknown',
                    knownFor: creditsData.cast
                        .sort((a, b) => b.popularity - a.popularity)
                        .slice(0, 10)
                        .map(movie => ({
                            id: movie.id,
                            title: movie.title,
                            poster: movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : '/placeholder.jpg',
                            role: movie.character || 'Unknown Role',
                            year: movie.release_date?.split('-')[0] || 'TBA'
                        })),
                    personalInfo: {
                        birthName: personData.also_known_as?.[0] || personData.name,
                        gender: personData.gender === 1 ? 'Female' : 'Male',
                        birthday: personData.birthday,
                        age: personData.birthday ? calculateAge(personData.birthday) : null,
                        birthPlace: personData.place_of_birth,
                        knownCredits: creditsData.cast.length + creditsData.crew.length,
                        popularity: personData.popularity?.toFixed(1),
                        deathday: personData.deathday,
                    },
                    socialMedia: {
                        instagram: externalIds.instagram_id,
                        twitter: externalIds.twitter_id,
                        facebook: externalIds.facebook_id,
                    },
                    filmography: creditsData.cast
                        .filter(movie => movie.release_date) // Filter out movies without release dates
                        .map(movie => ({
                            id: movie.id,
                            title: movie.title,
                            poster: movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : '/placeholder.jpg',
                            character: movie.character || 'Unknown Role',
                            releaseDate: movie.release_date,
                            rating: movie.vote_average?.toFixed(1),
                            year: movie.release_date?.split('-')[0] || 'TBA'
                        }))
                };

                setData(transformedData);
                setLoading(false);
                setError(null);

            } catch (err) {
                console.error('Error fetching actor details:', err);
                setError(err.message || 'Failed to fetch actor details');
                setLoading(false);
            }
        };

        fetchActor();
    }, [actorId]);

    return { data, loading, error };
}

// Helper function for calculating age
function calculateAge(birthday) {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
const ranks = [
    { name: 'Beginner', experience: 0 },
    { name: 'Novice', experience: 100 },
    { name: 'Apprentice', experience: 250 },
    { name: 'Journeyman', experience: 500 },
    { name: 'Expert', experience: 1000 },
    { name: 'Master', experience: 2000 },
    { name: 'Grandmaster', experience: 5000 },
    { name: 'Legend', experience: 10000 },
];

function getRank(experience: number) {
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (experience >= ranks[i].experience) {
            return ranks[i].name;
        }
    }
    return 'Unranked';
}

export { ranks, getRank };
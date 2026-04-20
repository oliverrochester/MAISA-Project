export const sortText = async (commaSeparatedNumberList) => {
    const response = await fetch(`/api/sort-text`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commaSeparatedNumberList),
    });
    if (!response.ok) {
        throw new Error('Failed to sort text');
    }
    const data = await response.json();
    return data;
};
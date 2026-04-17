export const sortText = async (textData) => {
    const response = await fetch(`/api/sort-text`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(textData),
    });
    if (!response.ok) {
        throw new Error('Failed to sort text');
    }
    const data = await response.json();
    return data;
};
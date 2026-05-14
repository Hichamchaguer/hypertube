import axios from "axios";

export const fetchMovies = async () => {

    try {

        const response = await axios.get(
            "https://archive.org/advancedsearch.php",
            {
                params: {
                    q: 'mediatype:(movies)',
                    fl: 'identifier,title,description',
                    rows: 20,
                    page: 1,
                    output: 'json'
                }
            }
        );

        return response.data.response.docs;

    } catch (err) {

        console.error(err);
        throw new Error(
            "Failed to fetch movies"
        );
    }
};
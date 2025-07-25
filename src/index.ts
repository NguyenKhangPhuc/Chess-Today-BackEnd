import server from "./app";
import { PORT } from './utils/config';

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
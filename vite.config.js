import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import adsense from 'vite-plugin-adsense';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),adsense ({
    client: 'ca-pub-3022243059632861',
  }),],
})

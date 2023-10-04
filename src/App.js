import './assets/css/A.animate.css+flaticon.css+tiny-slider.css+glightbox.min.css+aos.css+style.css,Mcc.UgmKpvvBTJ.css.pagespeed.cf.xhAIVbA-KH.css';
import './App.css';
import "react-image-gallery/styles/css/image-gallery.css";
import Routes from "./routes/routes";
import { Provider } from "react-redux";
import initStore from "./redux/store";
import Theme from './styles/theme';

export const store = initStore({});

const App = () => {
  return (
    <Provider store={store}>
        <Theme>
            <Routes />
        </Theme>
    </Provider>
  );
}

export default App;

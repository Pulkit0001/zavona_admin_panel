import './DangerButton.css';
import { Button } from 'primereact/button';

const DangerButton = (props:any) => {
      return (
   <Button {...props} className={`danger-button ${props.className}`} />
  )
};

export default DangerButton;

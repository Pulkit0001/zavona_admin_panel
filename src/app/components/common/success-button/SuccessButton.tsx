import './SuccessButton.css';
import { Button } from 'primereact/button';

const SuccessButton = (props:any) => {
  return (
   <Button {...props} className={`success-button ${props.className}`} />
  )
}

export default SuccessButton

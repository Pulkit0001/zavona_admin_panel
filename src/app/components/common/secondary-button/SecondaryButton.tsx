import { Button } from 'primereact/button';
import "./SecondaryButton.css"


// 
const SecondaryButton = (props:any) => {
  return (
   <Button {...props} className={`secondary-button ${props.className}`} />
  )
}

export default SecondaryButton

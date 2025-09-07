import { Button } from 'primereact/button';
import "./PrimaryButton.css"


// 
const PrimaryButton = (props:any) => {
  return (
   <Button {...props} className={`primary-button ${props.className}`} />
  )
}

export default PrimaryButton

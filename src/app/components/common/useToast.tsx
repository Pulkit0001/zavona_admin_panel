import { closeSnackbar, enqueueSnackbar } from "notistack";
enum ToasterType {
    SUCCESS = "success" ,
    WARNING = "warning" ,
    ERROR ="error",
    INFO = "info"
}
export const useToast = (summary:string ,message:string , title:string , duration:number=3000) => {
    
const TOASTERBACKGROUND = summary == ToasterType.SUCCESS ? 'success-toaster-gradient' : summary == ToasterType.ERROR ? 'error-toaster-gradient' : summary == ToasterType.WARNING ? 'warning-toaster-gradient' : 'info-toaster-gradient'
  const TOASTERICONBACKGROUND = summary == ToasterType.SUCCESS ? 'success-toaster-close-icon' : summary == ToasterType.ERROR ? 'error-toaster-close-icon' : summary == ToasterType.WARNING ? 'warning-toaster-close-icon' : 'info-toaster-close-icon'
const getIcon = () => {
        switch (summary) {
          case "success":
            return <div className="toaster-icon-container bg-success-primary rounded-xl"><i className="pi pi-check-circle "></i></div>;
          case "warning":
            return <div className="toaster-icon-container bg-warning-primary rounded-xl"> <i className="pi pi-exclamation-triangle"></i></div>;
          case "info":
            return <div className="toaster-icon-container bg-info-primary rounded-xl"><i className="pi pi-info-circle"></i> </div>;
          case "error":
            return <div className="toaster-icon-container bg-error-primary rounded-xl"><i className="pi pi-times-circle"></i></div>;
          default:
            return null;
        }
      };
    enqueueSnackbar('', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      autoHideDuration: duration ?? 3000,
      content:(key) => (
        <div className={`flex gap-2 items-center toaster-container toaster-color rounded-xl ${TOASTERBACKGROUND} }`}>
           {getIcon()}
          <div className={`toaster-content-body px-4 `}>
          <h3>{title}</h3>
          <p className="toaster-message-div">{message} </p>
          </div>
        {/* {isUndo && <p>Undo</p>} */}
          <div>
          <i className={`pi pi-times toaster-close-icon cursor-pointer p-1 ${TOASTERICONBACKGROUND}`}  onClick={() => closeSnackbar(key)}></i>
          </div>
        </div>
      ),
    });
  };
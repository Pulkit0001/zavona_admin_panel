export const setCookie = (name: string, value: string, days = 30) => {
    localStorage.setItem(name, typeof value == 'string' ? value : JSON.stringify(value))
    // const date = new Date();
    // date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
    // const expires = `expires=${date.toUTCString()}`;
    // document.cookie = `${name}=${value}; ${expires}; path=/`;
  };

export const getCookie = (name: string) => {
    const val = localStorage.getItem(name)
    return val ? (typeof val == 'string' ? val : JSON.parse(val)) : null
    // const cookies = document.cookie?.split("; ");
    // let cookieValue = null
    // cookies.forEach((cookie: string) => {
    //   const [key, value] = cookie.split('=')
    //   if (key == cookieName) {
    //     cookieValue = value
    //   }
    // }) 
    // return cookieValue
  }

  export const removeCookie = (name: string) => {
    localStorage.removeItem(name)
  };

   export const handleErrorMessage = (errorMessage:any , useToast:any) => {
    if(Array.isArray(errorMessage)){
     const message =   errorMessage?.slice(0,3)?.map((item:any) => item)?.join(", ")
        useToast('error' , message , '' , 3000)
    }
    else if(typeof errorMessage == 'string' ){
        useToast('error' , errorMessage , '' , 3000)
    }
  }

  export const formatDate = (value: string) => {
    if (!value || value === '-') return '-';
   return new Date(value).toLocaleString('en-US', {
     day: '2-digit',
     month: 'short',
     year: 'numeric',
     hour: '2-digit',
     minute: '2-digit',
     hour12: true
   });
  }

  export const IMAGE_BASE_URL = "https://zavona-s3-bucket.s3.amazonaws.com/"
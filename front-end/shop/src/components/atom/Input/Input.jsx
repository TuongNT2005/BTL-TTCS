export default function Input({type = "text", isRequired = false, placeholder = "", className = "", id, name, onChange}) {
    
    // console.log("Input render, onChange =", onChange);

    return  <input onChange={onChange} type={type} 
                placeholder={placeholder} 
                id={id} 
                className={className} 
                required={isRequired} 
                name={name}
                />

}
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React, { useState } from 'react';

function MyComponent(props: any ) {
  const {richTextRef} = props;
  const [value, setValue] = useState<string>('');

  const handleChange = (value: string) => {
    setValue(value);
    console.log(value);
  };


  return (
    <ReactQuill value={value}
              onChange={handleChange} ref={richTextRef}/>
  );

}

export default MyComponent;

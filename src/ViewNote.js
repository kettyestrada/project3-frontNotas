import './App.css';

export const ViewNote = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('jo' + e.target.public.value);
    const formData = new FormData();

    const title = e.target.title.value;
    const text = e.target.text.value;
    const category = 2; //e.target.category.value;
    const isPublic = e.target.public.value;

    formData.append('title', title);
    formData.append('text', text);
    formData.append('idCategory', category);
    formData.append('isPublic', isPublic);

    try {
      const resp = await fetch('http://localhost:8080/note', {
        'Content-Type': 'multipart/form-data',
        method: 'POST',
        body: formData,
      });

      console.log(resp);

      if (resp.status === 201) {
        /*const post = {
          id: resJson.id,
          title: title,
          body: body,
          userId: userId,
        };
        const copyNewArray = [post, ...posts];
        setPosts(copyNewArray);*/
        console.log('ok');
      } else {
        console.log('ocurrio un error');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <div className='row'>
            <div className='col-25'>
              <label htmlFor='title'>Title</label>
            </div>
            <div className='col-75'>
              <input
                type='text'
                id='title'
                name='title'
                placeholder='Put your title here...'
              />
            </div>
          </div>

          <div className='row'>
            <div className='col-25'>
              <label htmlFor='category'>Category</label>
            </div>
            <div className='col-75'>
              <select id='category' name='category'>
                <option value='0'>Not selected</option>
              </select>
            </div>
          </div>
          <div className='row'>
            <div className='col-25'>
              <label htmlFor='text'>Description</label>
            </div>
            <div className='col-75'>
              <textarea
                id='text'
                name='text'
                placeholder='Write something..'
              ></textarea>
            </div>
          </div>
          <div className='row'>
            <div className='col-25'>
              <label htmlFor='file'>Select a file</label>
            </div>
            <div className='col-75'>
              <input type='file' id='file' name='file' />
            </div>
          </div>
          <div className='row'>
            <div className='col-25'>
              <label htmlFor='isPublic'>Is public?</label>
            </div>
            <div className='col-75'>
              <input type='radio' id='public' name='is_public' value='true' />
              <label htmlFor='html'>Yes</label>
              <input
                type='radio'
                id='public'
                name='is_public'
                value='false'
                checked
              />
              <label htmlFor='html'>No</label>
            </div>
          </div>
          <div className='row'>
            <input type='submit' value='Submit' />
          </div>
        </form>
      </div>
    </>
  );
};

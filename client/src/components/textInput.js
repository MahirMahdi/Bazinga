import EmojiPicker from 'emoji-picker-react';
import plus from '../assets/plus.png';

export default function TextInput({handleEmojiClick,handleEmojiPicker,handleSubmit,emojiPicker,handleTextChange,handleImageChange,text,image}){
    
    return(
        <div className="text-input-container">
            <div className='emoji' onClick={handleEmojiPicker}>
                {emojiPicker && <div className="emoji-picker"><EmojiPicker onEmojiClick={handleEmojiClick}/></div>}
            </div>
            <div className= {image? 'file-selected': 'no-file'}><span>1</span></div>
            <form className="input-container" onSubmit={handleSubmit}>
                <div className='file-container'>
                    <input type="file" id='unique' className="file-input" accept='image/*' onChange={handleImageChange}/>
                    <label htmlFor="unique"><img className="add-file" src={plus}/></label>
                </div>
                <input type="text" value={text} className="text-input" onChange={handleTextChange}/>
                <button className="send-button" type="submit" disabled={image || text ? false : true}></button>
            </form>
        </div>
    )
}
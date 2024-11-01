import React from 'react';

export default function ImageForm() {
    return (
        <form>
            <label htmlFor='title'>Title</label>
            <input type='text' name='title' id='title' />

            <label htmlFor='description'>Description</label>
            <textarea name='description' id='description'></textarea>

            
        </form>
    );
}

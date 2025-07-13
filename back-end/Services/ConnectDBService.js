import mongoose from "mongoose";
async function connectDatabase(){
  try {
    await mongoose.connect('mongodb+srv://khavinhthuan114:78ksoVGng6IZpPBt@cluster0.9ur4j7b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
   console.log('Connect database success');
  } catch(err) {
    console.log('connect database fail', err);
  }
}
export default connectDatabase;
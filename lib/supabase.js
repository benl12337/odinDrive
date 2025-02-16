const { createClient } = require('@supabase/supabase-js') ;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API);

async function uploadFile(file, path) {
    const { data, error } = await supabase.storage.from('odinDrive').upload(path, file);
    if (error) {
        // Handle error
        console.log('FAILED');
        console.log(error);
    } else {
        // Handle success
        console.log('the path is: ', path);
        console.log('SUCCESS!')
    }
};

async function downloadFile(path) {
    console.log('the path is: ON SUPABASE ', path);
    const { data, error} = await supabase.storage.from('odinDrive').download(path);
    if (error) {
        console.error(error);
    } else {
        return data;
    }
}   

module.exports = { uploadFile, downloadFile };

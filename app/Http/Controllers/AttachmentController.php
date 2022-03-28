<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends BaseController
{

    public function index(Request $request)
    {
        //pagination attachment
        $attachments = Attachment::orderBy('id', 'desc')
            // ->when($request->has('page'), function ($query) use ($request) {
            //     return $query->paginate($request->get('page'));
            // })
            ->paginate(20);

        return $this->ok($attachments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required',
        ]);

        $folder = "upload/" . ($request->has("folder") ? $request->folder : "default");

        $file = $request->file('file');

        $fileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . "_" . time() . "." . $file->getClientOriginalExtension();

        Storage::disk('public')->putFileAs(
            $folder,
            $file,
            $fileName
        );

        $attachment = new Attachment();
        $attachment->name = $fileName;
        $attachment->extension = $file->getClientOriginalExtension();
        $attachment->size = $file->getSize();
        $attachment->mime = $file->getClientMimeType();
        $attachment->url = '/storage/' . $folder . "/" . $fileName;
        $attachment->save();

        return $this->ok($attachment);

    }

    //destroy
    public function destroy(Attachment $attachment)
    {
        //remove storage from url
        $path = str_replace("/storage/", "", $attachment->url);
        Storage::disk('public')->delete($path);
        $attachment->delete();
        return $this->success();
    }
}

<?php

namespace App\Http\Controllers;

use App\Events\Message as MessageEvent;
use App\Models\Message as Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index() 
    {
        return Message::all();
    }

    public function message(Request $request)
    {
        event(new MessageEvent($request->input('username'), $request->input('message'), $request->input('sender')));

        $receiverId = $request->input('username');
        $messageText = $request->input('message');

        $message = new Message();
        $message->user_id = $request->input('sender');
        $message->receiver_id = $receiverId;
        $message->message = $messageText;
        $message->save();

        return response()->json(['message' => 'Message saved successfully'], 201);
    }
}

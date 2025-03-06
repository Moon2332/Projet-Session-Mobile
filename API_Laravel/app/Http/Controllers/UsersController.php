<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{

    public function login(LoginRequest $request)
    {
        $request->validated($request->all());

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Messages.login.error',
                'message2' => 'Messages.login.error2'
            ], 401);
        }

        $user = Auth::user();

        return response()->json([
            'message' => 'Messages.login.success',
            'user' => $user,
            'token' => $user->createToken($user->email)->plainTextToken
        ]);
    }

    public function signup(Request $request)
    {
        try {
            $user = User::create([
                'email' => $request->email,
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'password' => Hash::make($request->password),
            ]);
    
            return response()->json([
                'message' => 'Messages.signup.success',
                'user' => $user,
                'token' => $user->createToken($user->email)->plainTextToken
            ]);
        } catch (\Throwable $e) {
            Log::debug($e);
            return response()->json(['message' => "Messages.signup.error"], 422);
        }
    }

    public function logout()
    {
        try {
            Auth::user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Messages.logout'
            ]);
        }catch (\Throwable $e) {
            Log::debug($e);
            return response()->json(['message' => "Messages.logout.error"], 422);
        }
    }

    public function refreshToken()
    {
        $user = Auth::user();
        $user->currentAccessToken()->delete();

        return response()->json([
        'user' => $user,
        'token' => $user->createToken($user->email)->plainTextToken
        ]);    
    }

    public function updateUser(SignUpRequest $request)
    {
        try {
            $request->validated($request->all());
            $data = $request->all();
            $id = $data['id'];
            
            $user = User::findOrFail($id);
            
            $user->firstname = $data['firstname'];
            $user->lastname = $data['lastname'];
            $user->email = $data['email'];

            return response()->json([
                "message" => "Messages.user.success",
                "user" => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Messages.user.error"
            ], 500);
        }
    }

    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        if (!Hash::check($request->old_p, $user->password)) {
            return response()->json(['message' => 'Messages.password.error'], 422);
        }

        $user->password = Hash::make($request->new_p);
        $user->save();

        return response()->json(['message' => 'Messages.password.success'], 200);
    }

    public function deleteUser()
    {
        $user = Auth::user();
        try {
            $user->currentAccessToken()->delete();
            $user->delete();
            return response()->json(['message' => "Messages.delete.success"], 200);
        } catch (\Throwable $e) {
            Log::debug($e);
            return response()->json(['message' => "Messages.delete.error"], 422);
        }
    }
}

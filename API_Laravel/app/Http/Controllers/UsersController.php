<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignUpRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{

    public function login(LoginRequest $request)
    {
        Log::debug("IN LOGIN");
        $request->validated($request->all());
        Log::debug("Request" .  $request->validated($request->all()));

        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->error('', 'Le courriel ou le mot de passe n\'est pas valide', 401);
        }

        $user = Auth::user();
        Log::debug("User - " .$user);

        Log::debug(json_encode([
            'USER' => $user->email,
            'TOKEN' => $user->createToken($user->email)->plainTextToken
        ]));

        return response()->json([
            'user' => $user,
            'token' => $user->createToken($user->email)->plainTextToken
        ]);
    }

    public function register(RegisterRequest $request)
    {
        $request->validated($request->all());

        $user = User::create([
        'email' => $request->email,
        'firstname' => $request->firstname,
        'lastname' => $request->lastname,
        'password' => Hash::make($request->password),
        ]);


        return $this->success([
        'user' => $user,
        'token' => $user->createToken('API Token of ' . $user->email)->plainTextToken
        ]);
    }

    public function logout()
    {
        Auth::user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'déconnecté'
        ]);
    }

    public function refreshToken()
    {
        $user = Auth::user();
        $user->currentAccessToken()->delete();

        return $this->success([
        'user' => $user,
        'token' => $user->createToken('API Token of ' . $user->email)->plainTextToken
        ]);    
    }
}

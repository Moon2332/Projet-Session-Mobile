<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotificationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('notifications')->insert([
            [
              'nom' => 'moon@gmail.com',
              'password' => Hash::make('moon'),
              'firstname' => 'Moon',
              'lastname' => 'Rayan',
            ],
            [
                'email' => 'nic@gmail.com',
                'password' => Hash::make('Secret1234!'),
                'firstname' => 'Amon',
                'lastname' => 'Mano',
              ]
        ]);
    }
}

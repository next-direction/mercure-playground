<?php

require_once 'vendor/autoload.php';

use ReallySimpleJWT\Token;
use Symfony\Component\Mercure\Jwt\StaticJwtProvider;
use Symfony\Component\Mercure\Publisher;
use Symfony\Component\Mercure\Update;

$payload = [
    'iat' => time(),
    'exp' => time() + 10,
    'mercure' => [
        'publish' => [
            'test'
        ]
    ]
];

define('HUB_SECRET', 'your-secret-here');
define('HUB_URL', 'your-hub-url-here');
try {
    $token = Token::customPayload($payload, HUB_SECRET);

    define('JWT', $token);
} catch (\Throwable $t) {
    echo $t->getMessage() . PHP_EOL;
}

if (defined('JWT')) {
    $publisher = new Publisher(HUB_URL, new StaticJwtProvider(JWT));
    $id = $publisher(new Update('my-own-topic', 'Hi from Symfony!', ['test']));

    echo 'Successfully published!' . PHP_EOL;
} else {
    die('JWT couldn\'t be created!');
}
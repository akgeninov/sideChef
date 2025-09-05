<?php
session_start();  // Start the session at the beginning

// load .env
$env = parse_ini_file(__DIR__.'/.env');

$host = $env['DB_HOST'];
$user = $env['DB_USER'];
$pass = $env['DB_PASS'];
$db   = $env['DB_NAME'];
$port = $env['DB_PORT'];

$conn = mysqli_connect($host, $user, $pass, $db, $port);

if (mysqli_connect_errno()) {
    die("Failed to connect to MySQL: " . mysqli_connect_error());
}

$op = isset($_GET['op']) ? $_GET['op'] : '';

switch ($op) {
    case 'register_user':
        register_user();
        break;
    case 'login_user':
        login_user();
        break;
    case 'get_logged_in_user':
        get_logged_in_user();
        break;
    case 'logout_user':
        logout_user();
        break;
    // case 'update_user_name':
    //     update_user_name();
    //     break;
    case 'get_category':
        get_categories();
        break;
    case 'add_recipe':
        add_recipe();
        break;
    case 'get_all_recipe':
        get_all_recipe();
        break;
    case 'get_category_by_id':
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        get_category_by_id($id);
        break;
    case 'get_name_category_by_id':
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        get_name_category_by_id($id);
        break;
    case 'get_recipe_by_category':
        $category_id = isset($_GET['category_id']) ? $_GET['category_id'] : '';
        get_recipe_by_category($category_id);
        break;
    case 'get_recipe_by_id':
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        get_recipe_by_id($id);
        break;
    case 'get_recipe_by_user':
        $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : '';
        get_recipe_by_user($user_id);
        break;
    case 'get_saved_recipe_by_user':
        $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : '';
        get_saved_recipe_by_user($user_id);
        break;
    case 'get_author_name_by_id':
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        get_author_name_by_id($id);
        break;
    // case 'save_recipe':
    //     $recipe_id = isset($_GET['recipe_id']) ? $_GET['recipe_id'] : '';
    //     save_recipe($recipe_id);
    //     break;
    case 'update_recipe':
        update_recipe();
        break;
    case 'delete_recipe':
        $id_recipe = isset($_GET['id_recipe']) ? $_GET['id_recipe'] : '';
        delete_recipe($id_recipe);
        break;
    case 'toggle_save_recipe':
        $recipe_id = isset($_GET['recipe_id']) ? $_GET['recipe_id'] : '';
        toggle_save_recipe($recipe_id);
        break;
    case 'check_bookmark':
        $recipe_id = isset($_GET['recipe_id']) ? $_GET['recipe_id'] : '';
        check_bookmark($recipe_id);
        break;
    default:
        echo json_encode(['data' => ['result' => 'Invalid operation']]);
        break;
}

function register_user()
{
    global $conn;
    if (isset($_REQUEST['username']) && isset($_REQUEST['email']) && isset($_REQUEST['password'])) {
        $username = $_POST['username'];
        $email = $_POST['email'];
        $password = md5($_POST['password']);

        $query = "INSERT INTO user (username, email, password) VALUES ('$username', '$email', '$password')";

        if ($conn->query($query) === TRUE) {
            // echo "Data berhasil ditambahkan.";
            echo json_encode(['data' => ['result' => 'User Register Success']]);
        } else {
            // echo "Error: " . $query . "<br>" . $conn->error;
            echo json_encode(['data' => ['result' => 'User Register Failed']]);
        }
    }
}

function login_user()
{
    global $conn;
    if (isset($_REQUEST['email']) && isset($_REQUEST['password'])) {
        $email = $_POST['email'];
        $password = ($_POST['password']);
        $hashed_password = md5($_POST['password']);

        $query = "SELECT * FROM user WHERE email='$email' AND password='$hashed_password'";
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            // Simpan email pengguna ke dalam session
            $_SESSION['email'] = $email;
            echo json_encode(['data' => ['result' => 'Login Success']]);
        } else {
            echo json_encode(['data' => ['result' => 'Login Failed']]);
        }
    }
}

function get_logged_in_user()
{
    global $conn;
    if (isset($_SESSION['email'])) {
        $email = $_SESSION['email'];
        $query = "SELECT * FROM user WHERE email='$email'";
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode(['data' => $row]);
        } else {
            echo json_encode(['data' => ['result' => 'User not found']]);
        }
    } else {
        echo json_encode(['data' => ['result' => 'No user logged in']]);
    }
}

function logout_user()
{
    session_unset();
    session_destroy(); // Destroy all session data

    echo json_encode(['data' => ['result' => 'Logout Success']]);
}

// function update_user_name() {
//     global $conn;
//     // Check both POST and GET for 'new_username'
//     if(isset($_SESSION['email']) && (isset($_POST['new_username']) || isset($_GET['new_username']))) {
//         $email = $_SESSION['email'];
//         $new_username = isset($_POST['new_username']) ? $_POST['new_username'] : $_GET['new_username'];

//         $query = "UPDATE user SET username='$new_username' WHERE email='$email'";
//         if ($conn->query($query) === TRUE) {
//             echo json_encode(['data' => ['result' => 'Username Updated Successfully']]);
//         } else {
//             echo json_encode(['data' => ['result' => 'Username Update Failed', 'error' => $conn->error]]);
//         }
//     } else {
//         echo json_encode(['data' => ['result' => 'Invalid Request']]);
//     }
// }

function get_categories()
{
    global $conn;

    $query = "SELECT id_category, name_category, image_category FROM category";
    $result = $conn->query($query);

    $categories = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
    }

    echo json_encode(['data' => $categories]);
}

function get_category_by_id($id)
{
    global $conn;

    $query = "SELECT id_category, name_category, image_category FROM category WHERE id_category='$id'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(['data' => $row]);
    } else {
        echo json_encode(['data' => ['result' => 'Category not found']]);
    }
}

function get_name_category_by_id($id)
{
    global $conn;

    $query = "SELECT name_category FROM category WHERE id_category='$id'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(['data' => $row]);
    } else {
        echo json_encode(['data' => ['result' => 'Category not found']]);
    }
}

function add_recipe()
{
    global $conn;
    if (isset($_SESSION['email'])) {
        $email = $_SESSION['email'];

        // Ambil id_user berdasarkan email
        $query = "SELECT id_user FROM user WHERE email='$email'";
        $result = mysqli_query($conn, $query);

        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $fk_id_user = $row['id_user'];

            // Ambil data dari form
            $name_recipe = $_POST['name_recipe'];
            $ingredients = $_POST['ingredients'];
            $tutorial = $_POST['tutorial'];
            $fk_id_category = $_POST['fk_id_category'];
            $cover_recipe = $_POST['cover_recipe'];

            // Membuat query untuk memasukkan data ke dalam tabel recipe
            $query = "INSERT INTO recipe (name_recipe, ingredients, tutorial, fk_id_category, fk_id_user, cover_recipe)
                      VALUES ('$name_recipe', '$ingredients', '$tutorial', '$fk_id_category', '$fk_id_user', '$cover_recipe')";
            // Eksekusi query
            if (mysqli_query($conn, $query)) {
                echo json_encode(["message" => "Recipe added successfully."]);
            } else {
                echo json_encode(["error" => "Error: " . mysqli_error($conn)]);
            }
        } else {
            echo json_encode(["error" => "User not found."]);
        }
    } else {
        echo json_encode(["error" => "User is not logged in."]);
    }
}



function get_recipe_by_category($category_id)
{
    global $conn;

    // Debugging: Tampilkan nilai $category_id
    error_log("Category ID: " . $category_id);

    $query = "SELECT id_recipe, name_recipe, ingredients, tutorial, fk_id_category, fk_id_user, cover_recipe FROM recipe WHERE fk_id_category='$category_id'";
    $result = $conn->query($query);

    // Debugging: Periksa apakah query berhasil dijalankan
    if ($result === false) {
        error_log("Query Error: " . $conn->error);
        echo json_encode(['data' => ['result' => 'Query Error']]);
        return;
    }

    $recipes = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $recipes[] = $row;
        }
    } else {
        // Debugging: Tidak ada hasil yang ditemukan
        error_log("No recipes found for category ID: " . $category_id);
    }

    echo json_encode(['data' => $recipes]);
}

function get_all_recipe()
{
    global $conn;

    $query = "SELECT * FROM recipe";
    $result = $conn->query($query);

    $categories = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $recipes[] = $row;
        }
    }

    echo json_encode(['data' => $recipes]);
}

function get_recipe_by_id($id)
{
    global $conn;

    $query = "SELECT id_recipe, name_recipe, ingredients, tutorial, fk_id_category, fk_id_user, cover_recipe FROM recipe WHERE id_recipe='$id'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(['data' => $row]);
    } else {
        echo json_encode(['data' => ['result' => 'Recipe not found']]);
    }
}

function get_recipe_by_user($user_id)
{
    global $conn;

    // Debugging: Tampilkan nilai $category_id
    error_log("User ID: " . $user_id);

    $query = "SELECT id_recipe, name_recipe, ingredients, tutorial, fk_id_category, fk_id_user, cover_recipe FROM recipe WHERE fk_id_user='$user_id'";
    $result = $conn->query($query);

    // Debugging: Periksa apakah query berhasil dijalankan
    if ($result === false) {
        error_log("Query Error: " . $conn->error);
        echo json_encode(['data' => ['result' => 'Query Error']]);
        return;
    }

    $recipes = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $recipes[] = $row;
        }
    } else {
        // Debugging: Tidak ada hasil yang ditemukan
        error_log("No recipes found for user ID: " . $user_id);
    }

    echo json_encode(['data' => $recipes]);
}

function get_saved_recipe_by_user($user_id)
{
    global $conn;

    // Debugging: Tampilkan nilai $category_id
    error_log("User ID: " . $user_id);

    $query = "SELECT * FROM saved WHERE fk_id_user='$user_id'";
    $result = $conn->query($query);

    // Debugging: Periksa apakah query berhasil dijalankan
    if ($result === false) {
        error_log("Query Error: " . $conn->error);
        echo json_encode(['data' => ['result' => 'Query Error']]);
        return;
    }

    $recipes = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $recipes[] = $row;
        }
    } else {
        // Debugging: Tidak ada hasil yang ditemukan
        error_log("No recipes found for user ID: " . $user_id);
    }

    echo json_encode(['data' => $recipes]);
}

function get_author_name_by_id($id) {
    global $conn;

    $query = "SELECT username FROM user WHERE id_user='$id'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(['data' => $row]);
    } else {
        echo json_encode(['data' => ['result' => 'Author not found']]);
    }
}

function save_recipe()
{
    global $conn;

    if (isset($_SESSION['email'])) {
        $email = $_SESSION['email'];

        // Ambil id_user berdasarkan email
        $query = "SELECT id_user FROM user WHERE email='$email'";
        $result = mysqli_query($conn, $query);

        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $fk_id_user = $row['id_user'];

            // Debugging: Tampilkan id_user yang diperoleh
            error_log("User ID: " . $fk_id_user);

            // Ambil id_recipe dari parameter GET
            if (isset($_GET['fk_id_receipt'])) {
                $fk_id_receipt = $_GET['fk_id_receipt'];

                // Debugging: Tampilkan id_recipe yang diterima
                error_log("Recipe ID: " . $fk_id_receipt);

                // Periksa apakah id_recipe ada di tabel recipe
                $query = "SELECT id_recipe FROM recipe WHERE id_recipe='$fk_id_receipt'";
                $result = mysqli_query($conn, $query);

                if (mysqli_num_rows($result) > 0) {
                    // Membuat query untuk memasukkan data ke dalam tabel saved
                    $query = "INSERT INTO saved (fk_id_receipt, fk_id_user) VALUES ('$fk_id_receipt', '$fk_id_user')";

                    // Debugging: Tampilkan query yang dieksekusi
                    error_log("Insert Query: " . $query);

                    // Eksekusi query
                    if (mysqli_query($conn, $query)) {
                        echo json_encode(["message" => "Recipe saved successfully."]);
                    } else {
                        echo json_encode(["error" => "Error: " . mysqli_error($conn)]);
                    }
                } else {
                    echo json_encode(["error" => "Recipe not found."]);
                }
            } else {
                echo json_encode(["error" => "Recipe ID not provided."]);
            }
        } else {
            echo json_encode(["error" => "User not found."]);
        }
    } else {
        echo json_encode(["error" => "User is not logged in."]);
    }
}


function update_recipe()
{
    global $conn;
    if (isset($_SESSION['email'])) {
        $email = $_SESSION['email'];

        $query = "SELECT id_user FROM user WHERE email='$email'";
        $result = mysqli_query($conn, $query);

        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $fk_id_user = $row['id_user'];

            $id_recipe = $_POST['id_recipe'];  // Ensure id_recipe is included in the POST data
            $name_recipe = $_POST['name_recipe'];
            $ingredients = $_POST['ingredients'];
            $tutorial = $_POST['tutorial'];
            $fk_id_category = $_POST['fk_id_category'];
            $cover_recipe = $_POST['cover_recipe'];

            $query = "UPDATE recipe SET 
                        name_recipe = '$name_recipe', 
                        ingredients = '$ingredients', 
                        tutorial = '$tutorial', 
                        fk_id_category = '$fk_id_category',
                        cover_recipe = '$cover_recipe'
                      WHERE id_recipe = '$id_recipe'";  // Use id_recipe to identify the recipe to update

            if (mysqli_query($conn, $query)) {
                echo json_encode(["message" => "Recipe updated successfully."]);
            } else {
                echo json_encode(["error" => "Error: " . mysqli_error($conn)]);
            }
        } else {
            echo json_encode(["error" => "User not found."]);
        }
    } else {
        echo json_encode(["error" => "User is not logged in."]);
    }
}

function delete_recipe($id_recipe)
{
    global $conn;

    if (isset($_SESSION['email'])) {
        $email = $_SESSION['email'];

        // Cek apakah user yang menghapus adalah pemilik resep
        $query = "SELECT id_user FROM user WHERE email='$email'";
        $result = mysqli_query($conn, $query);

        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $fk_id_user = $row['id_user'];

            // Mulai transaksi
            mysqli_begin_transaction($conn);
            try {
                // Hapus catatan terkait dalam tabel saved
                $queryDeleteSaved = "DELETE FROM saved WHERE fk_id_receipt='$id_recipe'";
                if (!mysqli_query($conn, $queryDeleteSaved)) {
                    throw new Exception("Error deleting saved records: " . mysqli_error($conn));
                }

                // Hapus resep
                $queryDeleteRecipe = "DELETE FROM recipe WHERE id_recipe='$id_recipe' AND fk_id_user='$fk_id_user'";
                if (!mysqli_query($conn, $queryDeleteRecipe)) {
                    throw new Exception("Error deleting recipe: " . mysqli_error($conn));
                }

                // Commit transaksi
                mysqli_commit($conn);
                echo json_encode(["message" => "Recipe deleted successfully."]);
            } catch (Exception $e) {
                // Rollback transaksi jika terjadi kesalahan
                mysqli_rollback($conn);
                echo json_encode(["error" => $e->getMessage()]);
            }
        } else {
            echo json_encode(["error" => "User not found."]);
        }
    } else {
        echo json_encode(["error" => "User is not logged in."]);
    }
}


function toggle_save_recipe($recipe_id)
{
    global $conn;

    if (isset($_SESSION['email'])) {
        $email = $_SESSION['email'];

        // Get the user ID based on the email
        $query = "SELECT id_user FROM user WHERE email='$email'";
        $result = mysqli_query($conn, $query);

        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $fk_id_user = $row['id_user'];

            // Check if the recipe is already saved
            $query = "SELECT * FROM saved WHERE fk_id_receipt='$recipe_id' AND fk_id_user='$fk_id_user'";
            $result = mysqli_query($conn, $query);

            if (mysqli_num_rows($result) > 0) {
                // Recipe already saved, delete it (unsave)
                $query = "DELETE FROM saved WHERE fk_id_receipt='$recipe_id' AND fk_id_user='$fk_id_user'";
                if (mysqli_query($conn, $query)) {
                    echo json_encode(["message" => "Recipe unsaved successfully."]);
                } else {
                    echo json_encode(["error" => "Error unsaving recipe: " . mysqli_error($conn)]);
                }
            } else {
                // Recipe not saved yet, insert it (save)
                $query = "INSERT INTO saved (fk_id_receipt, fk_id_user) VALUES ('$recipe_id', '$fk_id_user')";
                if (mysqli_query($conn, $query)) {
                    echo json_encode(["message" => "Recipe saved successfully."]);
                } else {
                    echo json_encode(["error" => "Error saving recipe: " . mysqli_error($conn)]);
                }
            }
        } else {
            echo json_encode(["error" => "User not found."]);
        }
    } else {
        echo json_encode(["error" => "User is not logged in."]);
    }
}

function check_bookmark($recipe_id)
{
    global $conn;

    if (isset($_SESSION['email'])) {
        $email = $_SESSION['email'];

        // Get the user ID based on the email
        $query = "SELECT id_user FROM user WHERE email='$email'";
        $result = mysqli_query($conn, $query);

        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $fk_id_user = $row['id_user'];

            // Check if the recipe is already saved
            $query = "SELECT * FROM saved WHERE fk_id_receipt='$recipe_id' AND fk_id_user='$fk_id_user'";
            $result = mysqli_query($conn, $query);

            if (mysqli_num_rows($result) > 0) {
                // Recipe is saved
                echo json_encode(["data" => ["bookmarked" => true]]);
            } else {
                // Recipe is not saved
                echo json_encode(["data" => ["bookmarked" => false]]);
            }
        } else {
            echo json_encode(["error" => "User not found."]);
        }
    } else {
        echo json_encode(["error" => "User is not logged in."]);
    }
}

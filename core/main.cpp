/*
* MIT License

* Copyright (c) 2025 Denis Klintukhov

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/


#include "pch.h"

#include "EventHandlers.h"

using namespace Core;

int main(int, char const**)
{
    try
    {
        std::locale::global(std::locale(""));
    }
    catch(const std::exception& e)
    {
        std::cerr << e.what() << std::endl;
    }

    webui::window win;

    win.set_size(1024, 768);

    win.bind("GenerateExpressions", EventHandlers::GenerateExpressionsHandler);
    win.bind("SolveExpressions", EventHandlers::SolveExpressionsHandler);
    win.bind("SaveExercise", EventHandlers::SaveExerciseHandler);
    win.bind("DeleteExercise", EventHandlers::DeleteExerciseHandler);
    win.bind("LoadExercises", EventHandlers::LoadExercisesHandler);
    win.bind("GetAppInfo", EventHandlers::GetAppInfoHandler);

    win.show_browser("index.html", static_cast<unsigned int>(win.get_best_browser()));

    webui::wait();

    return 0;
}

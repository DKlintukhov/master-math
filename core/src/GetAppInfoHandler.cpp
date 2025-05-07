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
#include "Exercise.h"
#include "Utf8.h"

namespace Core::EventHandlers
{
    void GetAppInfoHandler(webui::window::event* event)
    {
        try
        {
            const AppInfo appInfo = GetAppInfo();
            const boost::json::object json = AppInfoToJson(appInfo);

            event->return_string(boost::json::serialize(json));
        }
        catch (const std::exception& e)
        {
            boost::json::object errJson;
            errJson["error"] = e.what();
        }
    }

    AppInfo GetAppInfo()
    {
        return {
            PACKAGE_NAME,
            PACKAGE_VERSION,
            PACKAGE_HOMEPAGE_URL,
            PACKAGE_BUGREPORT_URL,
            PACKAGE_RELEASES_URL
        };
    }

    boost::json::object AppInfoToJson(const AppInfo& appInfo)
    {
        boost::json::object json;
        boost::json::object appInfoJson;

        appInfoJson["name"] = appInfo.name;
        appInfoJson["version"] = appInfo.version;
        appInfoJson["homepage"] = appInfo.homepage;
        appInfoJson["bugreport"] = appInfo.bugreport;
        appInfoJson["releases"] = appInfo.releases;

        json["appInfo"] = appInfoJson;

        return json;
    }
}
